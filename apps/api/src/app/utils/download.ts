import { createWriteStream, mkdirSync } from 'fs';
import { startsWith } from 'lodash';
import { dirname, join } from 'path';
import request from 'request';


export function download(uri: any, filename: any) {
    const fullPath = startsWith(filename, '/') ? filename : join(process.cwd(), filename);

    mkdirSync(dirname(fullPath), { recursive: true });

    return new Promise((resolve, reject) => {
        request.head(uri, (err: any) => {
            if (err) {
                reject(err);
                return;
            }
            request(uri).pipe(createWriteStream(fullPath)).on('close', (error: any, success: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(success);
            });
        });
    });
}

