import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tag } from './tag.entity';

@Schema({ timestamps: true })
export class Article {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    intro: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: Tag.name, required: true })
    tagid: Types.ObjectId;

    @Prop({ type: Number, default: 1 })
    state: number;

    @Prop({ type: Number, default: 0 })
    top: number;

    @Prop({ type: Number, default: 0 })
    watch: number;

    @Prop({ type: Number, default: 0 })
    likes: number;

    @Prop()
    img?: string;
}

export type ArticleDocument = HydratedDocument<Article>;

export const ArticleSchema = SchemaFactory.createForClass(Article);
