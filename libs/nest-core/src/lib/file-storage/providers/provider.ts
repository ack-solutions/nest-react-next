import { StorageEngine } from 'multer';
import { FileStorageOption, FileSystem, UploadedFile } from '../types/file-provider';

export abstract class Provider<T> {
	static instance: any;
	tenantId?: string;
	abstract name: string;
	abstract config: FileSystem;

	constructor() {}

	abstract url(path: string): string;
	abstract path(path: string): string;
	abstract handler(options: FileStorageOption): StorageEngine;
	abstract getFile(file: string): Promise<Buffer>;
	abstract putFile(
		fileContent: string | Buffer | URL,
		path?: string
	): Promise<UploadedFile>;
	abstract deleteFile(path: string): Promise<any>;
	abstract getInstance(): T;

	mapUploadedFile(file): UploadedFile {
		return file;
	}
}
