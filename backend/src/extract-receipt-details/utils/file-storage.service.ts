import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly uploadPath = process.env.UPLOAD_PATH;

  constructor() {
    fs.ensureDirSync(this.uploadPath);
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadPath, filename);
    
    await fs.writeFile(filePath, file.buffer);
    return filename;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadPath, filename);
  }
}