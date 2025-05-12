import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProcessReceiptDto {
  @ApiProperty({ type: Boolean, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true') // Convert string to boolean
  useGoogleVision?: boolean;
}