import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteTagDto {
    @ApiProperty({ description: '标签 ID' })
    @IsMongoId({ message: '标签 ID 非法' })
    id: string;
}
