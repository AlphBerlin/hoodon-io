import CryptoJS from 'crypto-js';
import { EncryptionResult } from '@/types/file';

export class FileEncryption {
    private static generateKey(): string {
        return 'h4AG5rp2hs+9VCp6ozOfU0zGCahClGwV7jM+kGPbDlLbVxo6V3tywxQ2vz8jd+6y'; //CryptoJS.lib.WordArray.random(32).toString();
    }

    private static generateIV(): string {
        return '6gtmU/awPcCmYxbrQc4pj/HuBtwCKH7ajDA/s24jDCw=' //CryptoJS.lib.WordArray.random(16).toString();
    }

    static async encryptFile(file: File): Promise<EncryptionResult> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

            const key = this.generateKey();
            const iv = this.generateIV();

            const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
                iv: CryptoJS.enc.Hex.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return {
                encryptedData: encrypted.toString(),
                key,
                iv
            };
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt file');
        }
    }

    static async decryptFile(
        encryptedData: string,
        key: string,
        iv: string
    ): Promise<ArrayBuffer> {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
                iv: CryptoJS.enc.Hex.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const typedArray = new Uint8Array(decrypted.words.length * 4);
            for (let i = 0; i < decrypted.words.length; i++) {
                const word = decrypted.words[i];
                typedArray[i * 4] = (word >> 24) & 0xff;
                typedArray[i * 4 + 1] = (word >> 16) & 0xff;
                typedArray[i * 4 + 2] = (word >> 8) & 0xff;
                typedArray[i * 4 + 3] = word & 0xff;
            }

            return typedArray.buffer;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt file');
        }
    }
}