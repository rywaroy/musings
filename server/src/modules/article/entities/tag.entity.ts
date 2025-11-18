import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Tag {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    color: string;

    @Prop({ type: Number, default: 1 })
    state: number;
}

export type TagDocument = HydratedDocument<Tag>;

export const TagSchema = SchemaFactory.createForClass(Tag);
