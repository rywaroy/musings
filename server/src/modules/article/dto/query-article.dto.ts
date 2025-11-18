import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryArticleDto {
    @ApiPropertyOptional({ description: '页码', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '页码必须为整数' })
    @Min(1, { message: '页码最小为 1' })
    page = 1;

    @ApiPropertyOptional({ description: '每页数量', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '每页数量必须为整数' })
    @Min(1, { message: '每页数量最小为 1' })
    @Max(100, { message: '每页数量最大为 100' })
    limit = 10;
}
