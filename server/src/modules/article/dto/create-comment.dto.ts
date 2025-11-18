import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @ApiPropertyOptional({ description: '评论昵称，默认匿名' })
    @IsOptional()
    @IsString({ message: '昵称必须为字符串' })
    @MaxLength(24, { message: '昵称长度过长' })
    name?: string;

    @ApiPropertyOptional({ description: '评论内容' })
    @IsString({ message: '评论内容必须为字符串' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    @MaxLength(1000, { message: '评论内容超过限制' })
    content: string;
}
