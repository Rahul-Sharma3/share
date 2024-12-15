import { storage, databases } from './config';
import { ID, Query } from 'appwrite';
import { createHash } from 'crypto';

export const fileService = {
    // Hash password helper
    hashPassword(password) {
        return createHash('sha256').update(password).digest('hex');
    },

    // Upload a new file
    async uploadFile(file, userId) {
        try {
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/svg+xml',
                'text/html',
                'video/mp4'
            ];

            if (!allowedTypes.includes(file.type)) {
                throw new Error(`File type ${file.type} is not supported`);
            }

            const uploadedFile = await storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileDoc = await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
                ID.unique(),
                {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    uploadDate: new Date().toISOString(),
                    storageFileId: uploadedFile.$id,
                    ownerId: userId,
                    isPublic: true,
                    password: null,
                    emailShares: []
                }
            );

            return fileDoc;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    // Get all files for a user
    async getFiles(userId) {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
                [
                    Query.equal('ownerId', userId),
                    Query.orderDesc('uploadDate')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching files:', error);
            throw error;
        }
    },

    // Get a single file by ID
    async getFileById(fileId) {
        try {
            return await databases.getDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
                fileId
            );
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error;
        }
    },

    // Delete a file
    async deleteFile(fileId, storageFileId) {
        try {
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                storageFileId
            );

            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
                fileId
            );
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    },

    // Get file preview
    getFilePreview(fileId) {
        return storage.getFilePreview(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            fileId
        );
    },

    // Get file download
    async downloadFile(fileId, password = null, isOwner = false) {
        try {
            const file = await this.getFileById(fileId)
            
            // Check if file needs password
            if (!isOwner && file.password && !file.isPublic) {
                if (!password) {
                    throw new Error('Password required')
                }
                
                const hashedInputPassword = this.hashPassword(password)
                if (hashedInputPassword !== file.password) {
                    throw new Error('Invalid password')
                }
            }

            const downloadUrl = storage.getFileDownload(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                file.storageFileId
            )

            return {
                url: downloadUrl,
                fileName: file.fileName,
                fileSize: file.fileSize
            }
        } catch (error) {
            console.error('Download error:', error)
            throw error
        }
    },

    // Add a method for file viewing if needed
    async getFileViewUrl(fileId) {
        try {
            const fileDoc = await this.getFileById(fileId)
            
            if (!fileDoc) {
                throw new Error('File not found')
            }

            const viewUrl = storage.getFileView(
                process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                fileDoc.storageFileId
            )

            return {
                url: viewUrl.href,
                fileName: fileDoc.fileName,
                fileType: fileDoc.fileType
            }
        } catch (error) {
            console.error('File view error:', error)
            throw error
        }
    },

    // Update file password
    async updateFilePassword(fileId, password) {
        try {
            return await databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
                fileId,
                {
                    password: password ? this.hashPassword(password) : null,
                    isPublic: !password
                }
            );
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    },
}