import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Article } from './article.entity';

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: Article.name, required: true })
    aid: Types.ObjectId;
}

export type CommentDocument = HydratedDocument<Comment>;

export const CommentSchema = SchemaFactory.createForClass(Comment);
