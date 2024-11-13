import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { get, set } from 'lodash';
import { Observable } from 'rxjs';
import { FileStorage } from '../file-storage';
import { FileStorageOption } from '../file-storage/types';

export function fileUploadInterceptor(
	fields: string[],
	storageOption?: FileStorageOption
): any {
	@Injectable()
	class UploadInterceptor implements NestInterceptor {
		async intercept(
			context: ExecutionContext,
			next: CallHandler
		): Promise<Observable<any>> {
			console.log(fields, 'fields');

			await this.saveFile(context);

			return next.handle();
		}

		private async saveFile(context: ExecutionContext) {
			const body = context.getArgByIndex(1);
			const storage = FileStorage.getInstance();

			for (let index = 0; index < fields.length; index++) {
				const field = fields[index];

				const file = get(body, field);

				if (file) {
					const { filename, createReadStream } = await file;

					const uploadedFile: Buffer = await new Promise(
						(resolve, reject) => {
							let fileBuffer: Buffer;
							const chunks = [];
							createReadStream()
								.on('data', (chunk) => {
									chunks.push(chunk);
								})
								.on('end', () => {
									fileBuffer = Buffer.concat(chunks);
									resolve(fileBuffer);
								})
								.on('error', (error) => reject(error));
						}
					);

					const ext = filename.split('.').pop();
					const newFileName = storage.generateFileName(ext);

					const path = storage
						.getProvider()
						.resolvePath(storageOption?.dest, newFileName);
					const uploadedFilePath = await storage.put(
						uploadedFile,
						path
					);

					set(body, field, uploadedFilePath.key);
				}
			}
		}
	}

	return UploadInterceptor;
}
