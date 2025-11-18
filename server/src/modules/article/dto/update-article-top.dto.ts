import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Min } from 'class-validator';

export class UpdateArticleTopDto {
    @ApiProperty({ description: '文章 ID' })
    @IsMongoId({ message: '文章 ID 非法' })
    id: string;

    @ApiProperty({ description: '置顶权重，数值越大越靠前' })
    @IsInt({ message: '置顶权重必须为整数' })
    @Min(0, { message: '置顶权重不能小于 0' })
    top: number;
}
