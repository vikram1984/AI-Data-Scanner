import { ReceiptItemDto } from './receipt-item.dto';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class ReceiptDataDto {
  @Transform(({ value }) => (value ? String(value) : "N/A"))
  @IsString()
  vendor_name: string;

  @Transform(({ value }) => (value ? String(value) : "N/A"))
  @IsString()
  currency: string;

  @Transform(({ value }) => (value ? value : Date.now()))
  date: Date;

  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @Min(0)
  amount: number;

  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @Min(0)
  tax: number;
  receipt_items: ReceiptItemDto[];
}