import { createWriteStream, mkdirSync } from 'fs';
import { startsWith } from 'lodash';
import { dirname, join } from 'path';
import request from 'request';


export function download(uri, filename) {
    const fullPath = startsWith(filename, '/') ?
        filename :
        join(process.cwd(), filename);

    mkdirSync(dirname(fullPath), { recursive: true });

    return new Promise((resolve, reject) => {
        request.head(uri, (err) => {
            if (err) {
                reject(err);
                return;
            }
            request(uri)
                .pipe(createWriteStream(fullPath))
                .on('error', (error: any) => {
                    reject(error);
                })
                .on('end', () => {
                    resolve(fullPath);
                });
        });
    });
}
