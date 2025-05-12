import { Injectable, Logger } from '@nestjs/common';
import { createWorker, RecognizeResult, Worker as TesseractWorker } from 'tesseract.js';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { ReceiptDataDto } from './dtos/receipt-data.dto';
import * as sharp from 'sharp';
import Groq from 'groq-sdk';

@Injectable()
export class ExtractReceiptDetailsService {
  private readonly logger = new Logger(ExtractReceiptDetailsService.name);
  private googleVisionClient: ImageAnnotatorClient | null = null;
  private groqClient;

  constructor() {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        this.googleVisionClient = new ImageAnnotatorClient();
        this.logger.log('Google Vision client initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Google Vision client', error.stack);
      }
    }
    const groqAPIKey=process.env.GROQ_API_KEY;
    this.groqClient = new Groq({
      apiKey:groqAPIKey
    });


  }
 /**
   * Process receipt image using TesseractJS
   * @param imageBuffer - The image buffer to process
   * @returns Extracted receipt data as string. 
   */
  async processWithTesseract(imageBuffer: Buffer): Promise<string> {
    this.logger.log('Starting Tesseract OCR processing');
    
    let worker: TesseractWorker | null = null;
    try {
      // Image preprocessing
      const processedImage = await sharp(imageBuffer)
        .greyscale()
        .normalize()
        .sharpen()
        .toBuffer();

      worker = await createWorker();
      
      const { data }: RecognizeResult = await worker.recognize(processedImage);
      this.logger.debug(`OCR results: ${data.text.substring(0, 50)}...`);
      
      this.logger.log('Tesseract OCR processing completed');
      return data.text;
    } catch (error) {
      this.logger.error('Error in Tesseract processing', error.stack);
      throw new Error(`Tesseract processing failed: ${error.message}`);
    } finally {
      if (worker) {
        await worker.terminate().catch(err => {
          this.logger.error('Failed to terminate Tesseract worker', err.stack);
        });
      }
    }
  }

  /**
   * Process receipt image using Google Vision API
   * @param imageBuffer - The image buffer to process
   * @returns Extracted receipt data as string. More accurate but paid.
   */
  async processWithGoogleVision(imageBuffer: Buffer): Promise<string> {
    if (!this.googleVisionClient) {
      throw new Error('Google Vision API is not configured');
    }

    this.logger.log('Starting Google Vision processing');
    
    try {
      const [result] = await this.googleVisionClient.textDetection(imageBuffer);
      const detections = result.textAnnotations;
      
      if (!detections || detections.length === 0) {
        throw new Error('No text detected in image');
      }

      // The first annotation contains the entire text
      const fullText = detections[0].description;
      this.logger.log('Google Vision processing completed');
      
      return fullText;
    } catch (error) {
      this.logger.error('Error in Google Vision processing', error.stack);
      throw new Error('Failed to process image with Google Vision');
    }
  }

  /**
   * Process extracted receipt data using language model calls through Groq APIs.
   * @param input string - The extracted text to process
   * @returns Extracted receipt data as json string
   */
  async parseReceiptTextWithGroq(text: string | null | undefined): Promise<ReceiptDataDto>  {
    if (!this.groqClient) {
      throw new Error('Groq client is not configured');
    }

    this.logger.log('Starting Groq text parsing');
    const receiptData: ReceiptDataDto = {
      vendor_name: '',
      currency: '',
      date: new Date(Date.now()),
      amount: 0,
      receipt_items: [],
      tax: 0,
    };
    
    const prompt = "use the following text which has been extracted from a receipt and identify name of the merchant as vendorName, currency in the receipt as currency in three letter currency code, date of the receipt, total bill amount as billAmount, list of items purchased, any miscellaneous charges or any applicable TAX or GST as totalTax. Return the result in pure json format strictly with fields as merchant name, date, bill amount and total tax as strings and list of items as an array with fields description as item name, price as the price of each item, quantity as number of each item purchases,amount as total amount for this ite and tax on this item. Do not add any additional explanation or text in the response and only a json file and for the list of items consider duplicate entries if detected. Here is the text "+text;
    try {
        const chatCompletion = await this.groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }, 
        temperature: 0.7,
      });
  
      const groqResonse = JSON.parse(chatCompletion.choices[0].message.content);
      console.log(groqResonse.vendorName);
      console.log(groqResonse.date);
      console.log(groqResonse.billAmount);
      console.log(groqResonse.totalTax);
      console.log(groqResonse.items);

      const receiptData: ReceiptDataDto = {
        vendor_name: groqResonse.vendorName,
        currency: groqResonse.currency,
        date: groqResonse.date,
        amount: +groqResonse.billAmount,
        tax: +groqResonse.totalTax,
        receipt_items: groqResonse.items.map(item => ({
          description: item.description,
          price: +item.price,
          quantity: +item.quantity,
          amount: +item.amount,
          tax: +item.tax

        }))
        
      };
      
      return receiptData;
 
    } catch (error) {
      this.logger.error('Error in groq parsing', error.stack);
      throw new Error('Failed to process image with groq');
    }
  }

  
}
