import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity()
export class ReceiptItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Receipt, receipt => receipt.receipt_items)
  receipt: Receipt;

  @Column({ length: 100 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}