import { createClient, SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

type ContentCategory = 'avatar' | 'images' | 'documents' | 'videos'

interface StorageConfig {
    supabaseUrl: string
    supabaseKey: string
    bucketName: string
}

interface UploadResult {
    publicUrl: string | null
    filePath: string | null
    error: Error | null
}

export class UserStorageService {
    private supabase: SupabaseClient
    private bucketName: string
    private readonly BASE_PATH = 'private'

    constructor(config: StorageConfig) {
        this.supabase = createClient(config.supabaseUrl, config.supabaseKey)
        this.bucketName = config.bucketName
    }

    /**
     * Generate MD5 hash for filename
     */
    private generateFileName(originalName: string): string {
        const timestamp = new Date().getTime()
        const randomString = Math.random().toString(36).substring(7)
        const hashInput = `${timestamp}-${randomString}-${originalName}`
        const hash = crypto.createHash('md5').update(hashInput).digest('hex')
        const extension = originalName.split('.').pop()
        return `${hash}.${extension}`
    }

    /**
     * Get the full path for a user's content
     */
    private getUserPath(userId: string, category: ContentCategory): string {
        return `${this.BASE_PATH}/users/${userId}/${category}`
    }

    /**
     * Check if a path exists
     */
    private async pathExists(path: string): Promise<boolean> {
        try {
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .list(path)

            return !error && Array.isArray(data)
        } catch {
            return false
        }
    }

    /**
     * Ensure folder exists without creating .folder file
     */
    private async ensureUserFolder(userId: string, category: ContentCategory): Promise<void> {
        const folderPath = this.getUserPath(userId, category)
        const exists = await this.pathExists(folderPath)

        if (!exists) {
            // We don't need to create a .folder file
            // Supabase will create the path when we upload the first file
            return
        }
    }

    /**
     * Upload user avatar
     * Only allows one avatar per user (overwrites existing)
     */
    async uploadAvatar(userId: string, file: File): Promise<UploadResult> {
        try {
            await this.ensureUserFolder(userId, 'avatar')

            const ext = file.name.split('.').pop()
            const fileName = `${this.generateFileName(file.name)}`
            const folderPath = this.getUserPath(userId, 'avatar')

            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(`${folderPath}/${fileName}`, file, {
                    upsert: true,
                    contentType: file.type
                })

            if (error) throw error

            const { data: { publicUrl } } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(`${folderPath}/${fileName}`)

            return {
                publicUrl,
                filePath: data.path,
                error: null
            }
        } catch (error) {
            return { publicUrl: null, filePath: null, error: error as Error }
        }
    }

    /**
     * Upload content to a specific category with MD5 hashed filename
     */
    async uploadContent(
        userId: string,
        category: ContentCategory,
        file: File
    ): Promise<UploadResult> {
        try {
            await this.ensureUserFolder(userId, category)

            const hashedFileName = this.generateFileName(file.name)
            const folderPath = this.getUserPath(userId, category)

            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(`${folderPath}/${hashedFileName}`, file, {
                    contentType: file.type
                })

            if (error) throw error

            const { data: { publicUrl } } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(`${folderPath}/${hashedFileName}`)

            return {
                publicUrl,
                filePath: data.path,
                error: null
            }
        } catch (error) {
            return { publicUrl: null, filePath: null, error: error as Error }
        }
    }

    /**
     * List all files in a category for a user
     */
    async listUserContent(userId: string, category: ContentCategory) {
        const folderPath = this.getUserPath(userId, category)
        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .list(folderPath)

        if (error) throw error

        return data.map(item => ({
            name: item.name,
            path: `${folderPath}/${item.name}`,
            publicUrl: this.getFileUrl(`${folderPath}/${item.name}`),
            metadata: item.metadata
        }))
    }

    /**
     * Delete a specific file
     */
    async deleteFile(userId: string, category: ContentCategory, fileName: string): Promise<boolean> {
        const filePath = `${this.getUserPath(userId, category)}/${fileName}`
        const { error } = await this.supabase.storage
            .from(this.bucketName)
            .remove([filePath])

        return !error
    }

    /**
     * Get public URL for a file
     */
    getFileUrl(filePath: string): string {
        const { data: { publicUrl } } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath)

        return publicUrl
    }
}