import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptDataDto } from './dtos/receipt-data.dto';
import { ProcessReceiptDto } from './dtos/process-receipt.dto';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExtractReceiptDetailsService } from './extract-receipt-details.service';
import { MysqlStorageService } from './utils/mysql-storage.service';

@ApiTags('Receipt-Extractor')

@Controller('api')
export class ExtractReceiptDetailsController {
  constructor(private readonly extractReceiptDetailsService: ExtractReceiptDetailsService, private readonly storageService: MysqlStorageService ) {}
  
  @Post('extract-receipt-details')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a receipt image for processing',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        options: {
          type: 'object',
          properties: {
            useGoogleVision: {
              type: 'boolean',
              default: false,
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Receipt processed successfully', type: ReceiptDataDto })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  @ApiResponse({ status: 500, description: 'OCR processing failed' })
  @UseInterceptors(FileInterceptor('file'))
  async processReceipt(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ProcessReceiptDto,
  ): Promise<ReceiptDataDto> {
    const useGoogleVision = body.useGoogleVision || false;
    //console.log(body);
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Validate file type
    if (!file.mimetype.match(/(jpeg|jpg|png)$/)) {
      throw new Error('Only JPEG, JPG, and PNG files are allowed');
    }
    
    // Process with either Google Vision or Tesseract
    if (useGoogleVision) {
      const extracted_text = await this.extractReceiptDetailsService.processWithGoogleVision(file.buffer);
      const receiptData =   await this.extractReceiptDetailsService.parseReceiptTextWithGroq(extracted_text);
      return this.storageService.saveReceipt(file, receiptData);
    } else {
      const extracted_text = await this.extractReceiptDetailsService.processWithTesseract(file.buffer);
      const receiptData =   await this.extractReceiptDetailsService.parseReceiptTextWithGroq(extracted_text);
      return this.storageService.saveReceipt(file, receiptData);
    }
  }
}
