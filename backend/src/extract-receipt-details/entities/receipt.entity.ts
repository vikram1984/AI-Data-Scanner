import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReceiptItem } from './receipt-item.entity';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ length: 100 })
  vendor_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  image_url: string;

  @OneToMany(() => ReceiptItem, item => item.receipt, { cascade: true })
  receipt_items: ReceiptItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}