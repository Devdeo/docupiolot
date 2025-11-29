
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as data URL.'));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

export function dataUrlToBlob(dataUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const parts = dataUrl.split(',');
        if (parts.length !== 2) {
            return reject(new Error('Invalid data URL.'));
        }
        const mimeType = parts[0].match(/:(.*?);/)?.[1];
        if (!mimeType) {
            return reject(new Error('Could not determine MIME type from data URL.'));
        }
        
        try {
            const byteString = atob(parts[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
            }
            resolve(new Blob([uint8Array], { type: mimeType }));
        } catch (error) {
            reject(error);
        }
    });
}
