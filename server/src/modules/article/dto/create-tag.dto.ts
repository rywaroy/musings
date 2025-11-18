import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
    @ApiProperty({ description: '标签标题' })
    @IsString({ message: '标题必须为字符串' })
    @IsNotEmpty({ message: '标题不能为空' })
    title: string;

    @ApiProperty({ description: '标签颜色' })
    @IsString({ message: '颜色必须为字符串' })
    @IsNotEmpty({ message: '颜色不能为空' })
    color: string;
}
