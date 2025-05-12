import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReceiptItem } from '../entities/receipt-item.entity';
import { Receipt } from '../entities/receipt.entity';
import { FileStorageService } from './file-storage.service';
import { ReceiptDataDto } from '../dtos/receipt-data.dto';


@Injectable()
export class MysqlStorageService {
    private readonly logger = new Logger(MysqlStorageService.name);
    constructor(
        @InjectRepository(Receipt)
        private receiptRepository: Repository<Receipt>,
        @InjectRepository(ReceiptItem)
        private itemRepository: Repository<ReceiptItem>,
        private fileStorage: FileStorageService,
    ) {
        this.logger.log('Initiallizing storage service...');
        

    }

    async saveReceipt(
        file: Express.Multer.File,
        receiptData: ReceiptDataDto,
    ): Promise<Receipt> {
        // Save image locally
        const filename = await this.fileStorage.saveFile(file);

        // Save to database
        const receipt = this.receiptRepository.create({
        amount: receiptData.amount,
        currency: receiptData.currency,
        vendor_name: receiptData.vendor_name,
        date: new Date(receiptData.date),
        tax: receiptData.tax,
        image_url: filename
        
        });

        const savedReceipt = await this.receiptRepository.save(receipt);

        // Save items
        const receipt_items = receiptData.receipt_items.map(item =>
        this.itemRepository.create({
            ...item,
            receipt: savedReceipt,
        }),
        );

        await this.itemRepository.save(receipt_items);

        return {
        ...savedReceipt,
        receipt_items,
        };
    }

    async getReceipt(id: number): Promise<Receipt> {
        return this.receiptRepository.findOne({
        where: { id },
        relations: ['items'],
        });
    }
    }