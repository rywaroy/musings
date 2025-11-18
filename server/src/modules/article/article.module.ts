import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article, ArticleSchema } from './entities/article.entity';
import { Tag, TagSchema } from './entities/tag.entity';
import { Comment, CommentSchema } from './entities/comment.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: Tag.name, schema: TagSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        UserModule,
    ],
    controllers: [ArticleController],
    providers: [ArticleService, AuthGuard],
})
export class ArticleModule {}
