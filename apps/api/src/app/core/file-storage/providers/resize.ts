import { copyFile } from 'fs';


// import sharp from 'sharp';
import { FileStorage } from '../file-storage';


// sharp.cache(false);

export async function createThumb(filePath, _size) {
    const fileParts = filePath.split('.');
    fileParts[0] = `${fileParts[0]}-thumb`;
    const newPath = fileParts.join('.');

    // await sharp(filePath)
    // 	.resize({
    // 		withoutEnlargement: true,
    // 		...size,
    // 	})
    // 	.webp({ force: false, quality: 70 })
    // 	.jpeg({ progressive: true, force: false, quality: 70 })
    // 	.png({ progressive: true, force: false, compressionLevel: 7 })
    // 	.toFile(newPath);

    return newPath;
}

export async function resizeImage(filePath, _size) {
    try {
        const fileParts = filePath.split('.');
        fileParts[0] = `${fileParts[0]}-orig`;
        const newPath = fileParts.join('.');

        await new Promise((resolve, reject) => {
            copyFile(filePath, newPath, (error) => {
                if (error) {
                    reject(error);
                }
                resolve(newPath);
            });
        });

        filePath = new FileStorage().getProvider().path(filePath);

        // const buffer = await sharp(filePath)
        // 	.resize({
        // 		withoutEnlargement: true,
        // 		...size,
        // 	})
        // 	.webp({ force: false, quality: 70 })
        // 	.jpeg({ progressive: true, force: false, quality: 70 })
        // 	.png({ progressive: true, force: false, compressionLevel: 7 })
        // 	.toBuffer();

        // await sharp(buffer).toFile(filePath);
    } catch (error) {
        console.log(error);
    }

    return filePath;
}
