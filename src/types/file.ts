export interface EncryptionResult {
    encryptedData: string;
    key: string;
    iv: string;
}

export interface FileMetadata {
    path: string;
    key: string;
    iv: string;
    originalName: string;
    mimeType: string;
    size: number;
}

export interface UploadProgress {
    onProgress?: (progress: number) => void;
}

export interface UploadHoodFile {
    file: File;
    userId: string;
    description?: string;
    onProgress?: (progress: number) => void;
}