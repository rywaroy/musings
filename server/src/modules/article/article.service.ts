import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import xss from 'xss';
import { Article, ArticleDocument } from './entities/article.entity';
import { Tag, TagDocument } from './entities/tag.entity';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UpdateArticleTopDto } from './dto/update-article-top.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { DeleteTagDto } from './dto/delete-tag.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectModel(Article.name)
        private readonly articleModel: Model<ArticleDocument>,
        @InjectModel(Tag.name)
        private readonly tagModel: Model<TagDocument>,
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,
    ) {}

    async getTags() {
        return this.tagModel
            .find({ state: 1 })
            .sort({ createdAt: -1 })
            .lean();
    }

    async createTag(dto: CreateTagDto) {
        const created = await this.tagModel.create(dto);
        return created.toObject();
    }

    async deleteTag(dto: DeleteTagDto) {
        const { id } = dto;
        const tag = await this.tagModel.findById(id).lean();
        if (!tag || tag.state === 0) {
            throw new NotFoundException('标签不存在');
        }
        await this.tagModel.updateOne({ _id: id }, { state: 0 }).exec();
    }

    async getArticles(query: QueryArticleDto) {
        const page = Number(query.page ?? 1) || 1;
        const limit = Number(query.limit ?? 10) || 10;
        const filter = { state: 1 };
        const [items, total] = await Promise.all([
            this.articleModel
                .find(filter)
                .populate({
                    path: 'tagid',
                    select: 'title color state',
                })
                .sort({ top: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            this.articleModel.countDocuments(filter),
        ]);

        return {
            list: items.map((item) => this.formatArticle(item)),
            total,
        };
    }

    async getArticleDetail(id: string) {
        const article = await this.articleModel
            .findOneAndUpdate(
                { _id: id, state: 1 },
                { $inc: { watch: 1 } },
                { new: true },
            )
            .populate({ path: 'tagid', select: 'title color state' })
            .lean();

        if (!article) {
            throw new NotFoundException('文章不存在或已删除');
        }

        return this.formatArticle(article);
    }

    async createArticle(dto: CreateArticleDto) {
        await this.ensureValidTag(dto.tagid);
        const created = await this.articleModel.create(dto);
        return this.formatArticle(created.toObject());
    }

    async updateArticle(id: string, dto: UpdateArticleDto) {
        if (dto.tagid) {
            await this.ensureValidTag(dto.tagid);
        }
        const updated = await this.articleModel
            .findOneAndUpdate({ _id: id, state: 1 }, dto, { new: true })
            .populate({ path: 'tagid', select: 'title color state' })
            .lean();
        if (!updated) {
            throw new NotFoundException('文章不存在或已删除');
        }
        return this.formatArticle(updated);
    }

    async deleteArticle(id: string) {
        const result = await this.articleModel.updateOne(
            { _id: id, state: 1 },
            { state: 0 },
        );
        if (!result.matchedCount) {
            throw new NotFoundException('文章不存在或已删除');
        }
    }

    async updateTop(dto: UpdateArticleTopDto) {
        const updated = await this.articleModel
            .findOneAndUpdate(
                { _id: dto.id, state: 1 },
                { top: dto.top },
                { new: true },
            )
            .lean();
        if (!updated) {
            throw new NotFoundException('文章不存在或已删除');
        }
        return this.formatArticle(updated);
    }

    async createComment(articleId: string, dto: CreateCommentDto, ip: string) {
        const article = await this.articleModel
            .findOne({ _id: articleId, state: 1 })
            .lean();
        if (!article) {
            throw new NotFoundException('文章不存在或已删除');
        }

        const name = this.sanitizeText(dto.name || '匿名');
        const content = this.sanitizeText(dto.content);
        if (this.calcDataLength(name) > 12) {
            throw new BadRequestException('昵称长度超过限制');
        }
        if (this.calcDataLength(content) > 1000) {
            throw new BadRequestException('评论内容超过限制');
        }

        const ipLabel = this.buildIpLabel(ip);

        const created = await this.commentModel.create({
            name: `${name} ${ipLabel}`,
            content,
            aid: article._id,
        });
        return this.formatComment(created.toObject());
    }

    async getComments(articleId: string) {
        const comments = await this.commentModel
            .find({ aid: articleId })
            .sort({ createdAt: -1 })
            .lean();
        return comments.map((item) => this.formatComment(item));
    }

    async likeArticle(id: string) {
        const updated = await this.articleModel
            .findOneAndUpdate(
                { _id: id, state: 1 },
                { $inc: { likes: 1 } },
                { new: true },
            )
            .lean();
        if (!updated) {
            throw new NotFoundException('文章不存在或已删除');
        }
        return this.formatArticle(updated);
    }

    private async ensureValidTag(id: string) {
        const tag = await this.tagModel.findOne({ _id: id, state: 1 }).lean();
        if (!tag) {
            throw new NotFoundException('标签不存在或已删除');
        }
    }

    private formatArticle(doc: any) {
        if (!doc) {
            return null;
        }
        const plain = doc.toObject ? doc.toObject() : { ...doc };
        const result: any = {
            ...plain,
            id: plain._id ? plain._id.toString() : undefined,
        };
        delete result._id;
        delete result.__v;
        if (plain.tagid && typeof plain.tagid === 'object' && plain.tagid !== null) {
            result.tag = {
                title: plain.tagid.title,
                color: plain.tagid.color,
            };
            result.tagid = plain.tagid._id?.toString();
        } else if (plain.tagid) {
            result.tagid = plain.tagid.toString();
        }
        return result;
    }

    private formatComment(doc: any) {
        if (!doc) {
            return null;
        }
        const plain = doc.toObject ? doc.toObject() : { ...doc };
        const result: any = {
            ...plain,
            id: plain._id ? plain._id.toString() : undefined,
        };
        delete result._id;
        delete result.__v;
        if (plain.aid) {
            result.aid = plain.aid.toString();
        }
        return result;
    }

    private sanitizeText(value: string) {
        return xss(value).trim();
    }

    private calcDataLength(value: string) {
        let length = 0;
        for (let i = 0; i < value.length; i += 1) {
            length += value.charCodeAt(i) > 255 ? 2 : 1;
        }
        return length;
    }

    private buildIpLabel(ip: string) {
        if (!ip) {
            return '**';
        }
        return `${ip.substring(0, 10)}**`;
    }
}
