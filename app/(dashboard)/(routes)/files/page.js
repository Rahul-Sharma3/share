"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { fileService } from '@/app/_services/file-service'
import { Download, Trash2, Share2, Loader, Upload, FolderOpen } from 'lucide-react'
import { formatBytes, formatDate } from '@/app/_utils/utils'
import FileViewModal from './FileViewModal'
import { DataTable } from './data-table'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { withLoadingDelay } from '@/app/_utils/loading'
import 'react-toastify/dist/ReactToastify.css'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, fileName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-[320px] md:max-w-sm mx-auto">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Confirm Deletion</h2>
                <p className="text-sm md:text-base mb-4 md:mb-6">
                    Are you sure you want to delete <span className="font-semibold break-all">{fileName}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 md:gap-4">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function FilesPage() {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const { userId } = useAuth()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, file: null })
    const [deletingFileId, setDeletingFileId] = useState(null)
    const [downloadingFileId, setDownloadingFileId] = useState(null)

    useEffect(() => {
        if (userId) {
            loadFiles()
        }
    }, [userId])

    const loadFiles = async () => {
        try {
            await withLoadingDelay(async () => {
                const data = await fileService.getFiles(userId)
                setFiles(data)
                setLoading(false)
            })
        } catch (error) {
            toast.error('Failed to load files')
            setLoading(false)
        }
    }

    const handleDelete = async (fileId, storageFileId) => {
        try {
            setDeletingFileId(fileId)
            await fileService.deleteFile(fileId, storageFileId)
            await loadFiles()
            setDeletingFileId(null)
            toast.success('File deleted successfully')
        } catch (error) {
            console.error('Error deleting file:', error)
            setDeletingFileId(null)
            toast.error('Failed to delete file')
        }
    }

    const handleView = (file) => {
        setSelectedFile(file)
    }

    const handleDownload = async (file) => {
        try {
            setDownloadingFileId(file.$id)
            const downloadInfo = await fileService.downloadFile(file.$id, null, true)
            
            // Create temporary link and trigger download
            const link = document.createElement('a')
            link.href = downloadInfo.url
            link.download = downloadInfo.fileName || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            toast.success(`Downloading ${file.fileName}...`, {
                position: "top-center"
            })
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to download file', {
                position: "top-center"
            })
        } finally {
            setDownloadingFileId(null)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    const filesWithActions = files.map(file => ({
        ...file,
        onView: () => handleView(file),
        onDelete: () => handleDelete(file.$id, file.storageFileId)
    }))

    const columns = [
        {
            header: 'Name',
            accessorKey: 'fileName',
        },
        {
            header: 'Size',
            accessorKey: 'fileSize',
            cell: ({ row }) => formatBytes(row.original.fileSize),
        },
        {
            header: 'Type',
            accessorKey: 'fileType',
        },
        {
            header: 'Uploaded',
            accessorKey: 'uploadDate',
            cell: ({ row }) => formatDate(row.original.uploadDate),
        },
        {
            header: 'Public',
            accessorKey: 'isPublic',
            cell: ({ row }) => (
                <span className={`${row.original.isPublic ? "text-green-600" : "text-red-600"}`}>
                    {row.original.isPublic ? "Yes" : "No"}
                </span>
            ),
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleDownload(row.original)}
                        disabled={downloadingFileId === row.original.$id}
                        className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                        title={downloadingFileId === row.original.$id ? "Downloading..." : "Download file"}
                    >
                        {downloadingFileId === row.original.$id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                    </button>
                    <button 
                        onClick={() => {
                            router.push(`/share/${row.original.$id}`)
                            toast.info('Opening sharing options...')
                        }}
                        className="p-2 hover:bg-green-50 rounded-full text-green-500 transition-colors"
                        title="Share file"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => setDeleteModal({ 
                            isOpen: true, 
                            file: row.original 
                        })}
                        disabled={deletingFileId === row.original.$id}
                        className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                        title={deletingFileId === row.original.$id ? "Deleting..." : "Delete file"}
                    >
                        {deletingFileId === row.original.$id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                </div>
            ),
        }
    ]

    return (
        <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
            {/* <h1 className="text-2xl font-bold mb-6">Your Files</h1> */}
            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6">
                    <div className="bg-white rounded-full p-4 shadow-sm mb-4">
                        <FolderOpen className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No Files Yet
                    </h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                        Upload your first file to get started. You can upload documents, images, and more.
                    </p>
                    <button
                        onClick={() => router.push('/upload')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        <Upload className="h-5 w-5" />
                        <span>Upload Your First File</span>
                    </button>
                    <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                            <span>Start your file sharing journey</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                            <span>Up to 2MB per file</span>
                        </div>
                    </div>
                </div>
            ) : (
                <DataTable 
                    data={filesWithActions}
                    columns={columns}
                />
            )}
            
            {selectedFile && (
                <FileViewModal 
                    file={selectedFile} 
                    onClose={() => setSelectedFile(null)} 
                />
            )}

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                fileName={deleteModal.file?.fileName}
                onClose={() => setDeleteModal({ isOpen: false, file: null })}
                onConfirm={() => {
                    handleDelete(deleteModal.file.$id, deleteModal.file.storageFileId)
                    setDeleteModal({ isOpen: false, file: null })
                }}
            />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
