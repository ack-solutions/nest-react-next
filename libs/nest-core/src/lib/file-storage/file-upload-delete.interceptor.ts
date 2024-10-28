import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
// import { FileStorage } from './file-storage';

export interface FileUploadWithHandleDeleteOptions extends MulterOptions {
  getOldFileName?: (fieldName: string) => string;
}

@Injectable()
export class FileUploadWithHandleDeleteInterceptor implements NestInterceptor {

  constructor(private fieldName: string, private localOptions?: FileUploadWithHandleDeleteOptions) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Check if the request has a file or a specific delete flag
    if (request.body[this.fieldName] === null || request.body[this.fieldName] === '') {
      if (this.localOptions.getOldFileName) {
        const key = this.localOptions.getOldFileName(this.fieldName);
        if (key) {
          // const fileStorage = new FileStorage();
          try {
            // await fileStorage.getProvider()?.deleteFile(key)
          } catch (error) {
            console.log('delete error', error);
          }
          // After deletion logic, proceed with the request
        }
      }
    }

    // Apply FileInterceptor logic here manually or extend its functionality
    const fileInterceptor = new (FileInterceptor(this.fieldName, this.localOptions))();
    fileInterceptor.intercept(context, next);



    // If a file is present, simply proceed
    return next.handle();
  }
}
