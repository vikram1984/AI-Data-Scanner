import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class ReceiptItemDto {

    @Transform(({ value }) => (value ? String(value) : "N/A"))
    @IsString()
    description: string;

    @Transform(({ value }) => (value ? Number(value) : 0))
    @IsNumber()
    @Min(0)
    price: number;

    @Transform(({ value }) => (value ? Number(value) : 0))
    @IsNumber()
    @Min(0)
    quantity: number;

    @Transform(({ value }) => (value ? Number(value) : 0))
    @IsNumber()
    @Min(0)
    amount:number;

    @Transform(({ value }) => (value ? Number(value) : 0))
    @IsNumber()
    @Min(0)
    tax:number;
  }