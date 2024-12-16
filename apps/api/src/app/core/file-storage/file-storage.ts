import moment from 'moment';

import * as Providers from './providers';
import { Provider } from './providers/provider';
import { FileStorageOption, FileStorageProviderEnum } from './types';


export class FileStorage {
    providers: { [key: string]: Provider<any> } = {};
    config: FileStorageOption = {
        dest: '',
    };
    private static instance: FileStorage;

    constructor(option?: FileStorageOption) {
        this.initProvider();
        this.setConfig(option);
    }

    static getInstance() {
        return this.instance ? this.instance : new this();
    }

    put(fileContent: string | Buffer | URL, path: any) {
        const provider = this.getProvider();
        return provider.putFile(fileContent, path);
    }

    generateFileName(ext) {
        return `${this.config.prefix ? this.config.prefix + '-' : ''}${moment().unix()}-${parseInt('' + Math.random() * 10000, 10)}.${ext}`;
    }

    setConfig(config: Partial<FileStorageOption> = {}) {
        this.config = {
            ...this.config,
            ...config,
            provider: (process.env.FILE_PROVIDER ||
                'local') as FileStorageProviderEnum,
        };
        return this;
    }

    setProvider(providerName: FileStorageProviderEnum) {
        if (providerName) {
            this.config.provider = providerName;
        }
        return this;
    }

    getProvider(providerName?: FileStorageProviderEnum) {
        this.setProvider(providerName);
        return this.getProviderInstance();
    }

    storage(option?: FileStorageOption) {
        let resp: any;
        this.setConfig(option);
        if (this.config.provider && this.providers[this.config.provider]) {
            resp = this.providers[this.config.provider].handler(this.config);
        } else {
            const provides = Object.values(FileStorageProviderEnum).join(', ');
            throw new Error(
                `Provider "${this.config.provider}" is not valid. Provider must be ${provides}`
            );
        }
        return resp;
    }

    getProviderInstance(): Provider<any> {
        return this.providers[this.config.provider].getInstance();
    }

    initProvider() {
        for (const key in Providers) {
            if (Object.prototype.hasOwnProperty.call(Providers, key)) {
                const className = Providers[key];
                if (className.instance === undefined) {
                    const provider: Provider<any> = new className();
                    this.providers[provider.name] = provider;

                    className.instance = provider;
                } else {
                    this.providers[className.instance.name] =
                        className.instance;
                }
            }
        }
    }
}
