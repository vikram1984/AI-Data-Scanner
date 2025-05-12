import { Module } from '@nestjs/common';
import { ExtractReceiptDetailsService } from './extract-receipt-details.service';
import { ExtractReceiptDetailsController } from './extract-receipt-details.controller';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [ExtractReceiptDetailsService],
  controllers: [ExtractReceiptDetailsController],
  
})
export class ExtractReceiptDetailsModule {
 
}
