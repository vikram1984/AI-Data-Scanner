import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtractReceiptDetailsService } from './extract-receipt-details/extract-receipt-details.service';
import { ExtractReceiptDetailsController } from './extract-receipt-details/extract-receipt-details.controller';
import { ConfigModule } from '@nestjs/config';
import { MysqlStorageService } from './extract-receipt-details/utils/mysql-storage.service';
import { FileStorageService } from './extract-receipt-details/utils/file-storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './extract-receipt-details/entities/receipt.entity';
import { ReceiptItem } from './extract-receipt-details/entities/receipt-item.entity'


@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
    cache: true,
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    entities: [Receipt, ReceiptItem],
    synchronize: true, // set to false in production
    autoLoadEntities: true, 
  }),
  
  TypeOrmModule.forFeature([Receipt, ReceiptItem])
  ],

  controllers: [AppController, ExtractReceiptDetailsController],
  providers: [AppService, ExtractReceiptDetailsService, MysqlStorageService, FileStorageService],
})
export class AppModule {}
