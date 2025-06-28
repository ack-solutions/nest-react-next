import {
    BlobSASPermissions,
    BlobSASSignatureValues,
    BlobServiceClient,
    generateBlobSASQueryParameters,
    SASProtocol,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';
import concat from 'concat-stream';
import moment from 'moment';
import { StorageEngine } from 'multer';
import path, { basename, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { AzureStorageOptions, Storage, UploadedFile } from '../types';


export class AzureStorage implements StorageEngine, Storage {

    private blobServiceClient: BlobServiceClient;

    private fileNameFunction: (file: Express.Multer.File, req?: any) => string | Promise<string>;
    private fileDistFunction: (file: Express.Multer.File, req?: any) => string | Promise<string>;


    constructor(private options: AzureStorageOptions) {
        this.fileNameFunction = options.fileName || ((file, _req) => {
            return `${uuidv4()}-${file.originalname}`;
        });

        this.fileDistFunction = options.fileDist || ((_file, _req) => {
            return path.join('uploads', moment().format('YYYY'), moment().format('MM'), moment().format('DD'));
        });

        const sharedKeyCredential = new StorageSharedKeyCredential(
            options.account,
            options.accountKey,
        );

        this.blobServiceClient = new BlobServiceClient(
            `https://${options.account}.blob.core.windows.net`,
            sharedKeyCredential,
        );
    }

    async _handleFile(
        req: any,
        file: any,
        cb: (error?: any, info?: any) => void,
    ): Promise<void> {
        try {
            const dist = await this.fileDistFunction(file, req);
            const key = await this.fileNameFunction(file, req);
            const filePath = join(dist, key);

            file.stream.pipe(concat({ encoding: 'buffer' }, async (buffer) => {
                const uploadedFile = await this.putFile(buffer, filePath);

                const fileInfo: UploadedFile = {
                    ...uploadedFile,
                    fieldName: file.fieldname,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                };
                let transformData = fileInfo;

                if (this.options?.transformUploadedFileObject) {
                    transformData = await this.options.transformUploadedFileObject(fileInfo);
                }
                cb(null, transformData);
            }));
        } catch (error) {
            cb(error);
        }

        file.stream.on('error', (err) => cb(err));
    }

    async _removeFile(
        _req: any,
        file,
        cb: (error: Error | null) => void,
    ): Promise<void> {
        try {
            const blobClient = this.blobServiceClient
                .getContainerClient(this.options.container)
                .getBlobClient(file.key);

            await blobClient.delete();
            cb(null);
        } catch (error) {
            cb(error);
        }
    }

    getUrl(key: string): string {
        return `https://${this.options.account}.blob.core.windows.net/${this.options.container}/${key}`;
    }


    getSignedUrl(key: string, signatureValues: Partial<Omit<BlobSASSignatureValues, 'containerName'>> = {}) {
        if (!key) return null;

        const cloudFrontDomain = process.env.AZURE_CDN_DOMAIN_NAME;

        if (cloudFrontDomain) {
            return `${cloudFrontDomain}/${key}`;
        }

        const containerClient = this.blobServiceClient.getContainerClient(this.options.container);
        const blobClient = containerClient.getBlobClient(key);

        const sharedKeyCredential = new StorageSharedKeyCredential(
            this.options.account,
            this.options.accountKey,
        );

        // Set the SAS token options
        const expiresOn = new Date();
        expiresOn.setHours(expiresOn.getHours() + 1); // Set expiration time to 1 hour from now

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: this.options.container,
                blobName: key,
                permissions: BlobSASPermissions.parse('r'), // Read permissions
                protocol: SASProtocol.Https, // HTTPS only
                startsOn: new Date(), // Start time (now)
                expiresOn, // Expiration time
                ...signatureValues,
            },
            sharedKeyCredential,
        ).toString();

        return `${blobClient.url}?${sasToken}`;
    }

    async getFile(key: string): Promise<Buffer> {
        const containerClient = this.blobServiceClient.getContainerClient(this.options.container);
        const blobClient = containerClient.getBlobClient(key);
        const downloadResponse = await blobClient.download();
        const stream = downloadResponse.readableStreamBody;

        return new Promise((resolve, reject) => {
            const chunks = [];
            stream?.on('data', (chunk) => chunks.push(chunk));
            stream?.on('end', () => resolve(Buffer.concat(chunks)));
            stream?.on('error', reject);
        });
    }

    async putFile(buffer: Buffer, key: string): Promise<UploadedFile> {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.options.container);
            const blockBlobClient = containerClient.getBlockBlobClient(key);

            await blockBlobClient.uploadData(buffer);

            const fileInfo: UploadedFile = {
                originalName: basename(key),
                fileName: basename(key),
                size: buffer.length,
                buffer,
                key,
                path: key,
                url: this.getUrl(key),
            };

            return fileInfo;
        } catch (error) {
            console.error(`Error uploading file "${key}":`, error);
            throw error;
        }
    }

    async deleteFile(key: string) {
        try {
            const blobClient = this.blobServiceClient
                .getContainerClient(this.options.container)
                .getBlobClient(key);

            await blobClient.delete();
        } catch (error) {
            console.error(`Error deleting blob "${key}":`, error);
        }
    }

    async copyFile(oldKey: string, newKey: string): Promise<UploadedFile> {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.options.container);
            const sourceBlobClient = containerClient.getBlobClient(oldKey);
            const destinationBlobClient = containerClient.getBlobClient(newKey);

            const copyPoller = await destinationBlobClient.beginCopyFromURL(sourceBlobClient.url);
            await copyPoller.pollUntilDone();

            const properties = await destinationBlobClient.getProperties();

            return {
                originalName: basename(newKey),
                size: properties.contentLength || 0,
                fileName: basename(newKey),
                key: newKey,
                path: newKey,
                url: this.getUrl(newKey),
            };
        } catch (error) {
            console.error('Error copying file in Azure Blob Storage:', error);
            throw error;
        }
    }


}
