export interface UploadResult {
    publicUrl: string | null
    filePath: string | null
    error: Error | null
}

export interface FileMetadata {
    contentType: string
    size: number
    lastModified: number
}
