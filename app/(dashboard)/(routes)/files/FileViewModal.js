import { storage } from '@/app/_services/config'
import { useState } from 'react'
import { fileService } from '@/app/_services/file-service'

export default function FileViewModal({ file, onClose }) {
    const [loading, setLoading] = useState(true)

    const getFileUrl = async () => {
        try {
            const fileInfo = await fileService.getFileViewUrl(file.$id)
            return fileInfo.url
        } catch (error) {
            console.error('Error getting file URL:', error)
            return null
        }
    }

    const renderPreview = async () => {
        const url = await getFileUrl()
        if (!url) return <div>Error loading preview</div>

        if (file.fileType.startsWith('image/')) {
            return <img src={url} alt={file.fileName} className="max-w-full h-auto" />
        }

        if (file.fileType === 'application/pdf') {
            return (
                <iframe
                    src={url}
                    className="w-full h-[80vh]"
                    title={file.fileName}
                />
            )
        }

        if (file.fileType === 'video/mp4' || file.fileType === 'mp4') {
            return (
                <video controls className="w-full">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )
        }

        return (
            <div className="text-center p-8">
                <p>Preview not available for this file type.</p>
                <a
                    href={url}
                    download={file.fileName}
                    className="text-blue-600 hover:underline mt-2 inline-block"
                >
                    Download File
                </a>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{file.fileName}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>
                <div className="max-h-[80vh] overflow-auto">
                    {renderPreview()}
                </div>
            </div>
        </div>
    )
} 