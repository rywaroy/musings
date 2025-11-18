import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
    @ApiProperty({ description: '文章标题' })
    @IsString({ message: '标题必须为字符串' })
    @IsNotEmpty({ message: '标题不能为空' })
    title: string;

    @ApiProperty({ description: '文章摘要' })
    @IsString({ message: '摘要必须为字符串' })
    @IsNotEmpty({ message: '摘要不能为空' })
    intro: string;

    @ApiProperty({ description: '文章内容' })
    @IsString({ message: '内容必须为字符串' })
    @IsNotEmpty({ message: '内容不能为空' })
    content: string;

    @ApiProperty({ description: '关联标签 ID' })
    @IsMongoId({ message: '标签 ID 非法' })
    tagid: string;

    @ApiProperty({ description: '封面图片地址', required: false })
    @IsOptional()
    @IsString({ message: '封面地址必须为字符串' })
    img?: string;
}
