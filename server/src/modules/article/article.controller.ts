import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { QueryArticleDto } from './dto/query-article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UpdateArticleTopDto } from './dto/update-article-top.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { DeleteTagDto } from './dto/delete-tag.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get('tag')
    getTags() {
        return this.articleService.getTags();
    }

    @Post('tag')
    createTag(@Body() dto: CreateTagDto) {
        return this.articleService.createTag(dto);
    }

    @UseGuards(AuthGuard)
    @Delete('tag')
    deleteTag(@Body() dto: DeleteTagDto) {
        return this.articleService.deleteTag(dto);
    }

    @Get()
    getArticles(@Query() query: QueryArticleDto) {
        return this.articleService.getArticles(query);
    }

    @Get(':id')
    getArticle(@Param('id', MongoIdPipe) id: string) {
        return this.articleService.getArticleDetail(id);
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() dto: CreateArticleDto) {
        return this.articleService.createArticle(dto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(
        @Param('id', MongoIdPipe) id: string,
        @Body() dto: UpdateArticleDto,
    ) {
        return this.articleService.updateArticle(id, dto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id', MongoIdPipe) id: string) {
        return this.articleService.deleteArticle(id);
    }

    @UseGuards(AuthGuard)
    @Post('top')
    updateTop(@Body() dto: UpdateArticleTopDto) {
        return this.articleService.updateTop(dto);
    }

    @Post(':id/comment')
    createComment(
        @Param('id', MongoIdPipe) id: string,
        @Body() dto: CreateCommentDto,
        @Req() req: Request,
    ) {
        const ip = this.getClientIp(req);
        return this.articleService.createComment(id, dto, ip);
    }

    @Get(':id/comment')
    getComments(@Param('id', MongoIdPipe) id: string) {
        return this.articleService.getComments(id);
    }

    @Post(':id/like')
    like(@Param('id', MongoIdPipe) id: string) {
        return this.articleService.likeArticle(id);
    }

    private getClientIp(req: Request) {
        const forwarded = req.headers['x-forwarded-for'];
        if (Array.isArray(forwarded)) {
            return forwarded[0];
        }
        if (typeof forwarded === 'string' && forwarded.length) {
            return forwarded.split(',')[0].trim();
        }
        if (req.ip) {
            return req.ip;
        }
        if (req.socket?.remoteAddress) {
            return req.socket.remoteAddress;
        }
        return '';
    }
}
