import { StorageEngine } from 'multer';
import { FileStorageOption, FileSystem, UploadedFile } from '../types';
import { GetObjectCommandInput } from '@aws-sdk/client-s3';

export abstract class Provider<T> {
	resolvePath(dest: string | CallableFunction, newFileName: string) {
		throw new Error('Method not implemented.');
	}
	static instance: any;
	tenantId?: string;
	abstract name: string;
	abstract config: FileSystem;

	abstract url(path: string, objectConfig?: Partial<GetObjectCommandInput>): any;
	abstract path(path: string): string;
	abstract handler(options: FileStorageOption): StorageEngine;
	abstract getFile(file: string): Promise<Buffer>;
	abstract putFile(
		fileContent: string | Buffer | URL,
		path?: string
	): Promise<UploadedFile>;
	abstract deleteFile(path: string): Promise<void>;
	abstract getInstance(): T;

	mapUploadedFile(file): UploadedFile {
		return file;
	}
}
