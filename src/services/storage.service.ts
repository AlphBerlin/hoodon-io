import {v4 as uuidv4} from 'uuid';
import {FileEncryption} from './encryption.service';
import {FileMetadata, UploadProgress} from '@/types/file';
import {supabase} from "@/lib/supabase/client";

export class StorageService {
    private static BUCKET_NAME = 'hood-files';

    private static generateFileName(originalName: string): string {
        const uuid = uuidv4();
        const extension = originalName.split('.').pop();
        return `${uuid}.${extension}`;
    }

    static async uploadFile(
        file: File,
        userId: string,
        {onProgress}: UploadProgress = {}
    ): Promise<FileMetadata> {
        try {
            // Generate unique filename
            const fileName = this.generateFileName(file.name);
            const filePath = `${userId}/${fileName}`;

            // Encrypt file
            const {encryptedData, key, iv} = await FileEncryption.encryptFile(file);

            // Convert encrypted string to Blob
            const encryptedBlob = new Blob([encryptedData], {
                type: 'application/octet-stream'
            });

            // Upload to Supabase
            const {data, error} = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, encryptedBlob, {
                    upsert: false,
                });

            if (error) throw error;

            return {
                path: data.path,
                key,
                iv,
                originalName: file.name,
                mimeType: file.type,
                size: file.size
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    static async downloadFile(
        path: string,
        key: string,
        iv: string
    ): Promise<ArrayBuffer> {
        try {
            const {data, error} = await supabase.storage
                .from(this.BUCKET_NAME)
                .download(path);

            if (error) throw error;

            const text = await data.text();
            return FileEncryption.decryptFile(text, key, iv);
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }
}