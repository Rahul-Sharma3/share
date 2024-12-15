"use client"
import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { fileService } from '@/app/_services/file-service'
import { useAuth } from '@clerk/nextjs'
import { authService } from '@/app/_services/auth-service'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export default function UploadForm({ uploadBtnClick, progress }) {
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const { userId } = useAuth()
    const router = useRouter()

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setError(null)

        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError('File size exceeds 2MB limit')
                return
            }
            setFile(selectedFile)
        }
    }

    const removeFile = () => {
        setFile(null)
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!file) {
            setError('Please select a file')
            return
        }

        try {
            setUploading(true)
            setError(null)

            // Create Appwrite session if needed
            await authService.createAppwriteSession(userId)

            // Upload file
            const response = await fileService.uploadFile(file, userId)
            toast.success('File uploaded successfully')
            
            // Start upload animation and pass the file ID
            if (uploadBtnClick) {
                uploadBtnClick(file, response.$id)
            }
        } catch (error) {
            console.error('Upload error:', error)
            setError(error.message || 'Failed to upload file')
            toast.error(error.message || 'Failed to upload file')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-4 pb-3">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PDF, Images, Videos (max 2MB)
                            </p>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.html,.mp4"
                            multiple={false}
                        />
                    </label>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mt-3 text-sm" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {file && (
                    <div className='flex items-center gap-2 justify-between mt-3 border rounded-md p-2 border-blue-200 bg-blue-50'>
                        <div className='flex items-center p-2'>
                            <Image src="/file.svg" alt="file" width={40} height={40} />
                            <div className='text-left ml-2'>
                                <h2 className='text-sm truncate max-w-[200px]'>{file.name}</h2>
                                <h2 className='text-[12px] text-gray-400'>
                                    {file.type} / {(file.size / 1024 / 1024).toFixed(2)}MB
                                </h2>
                            </div>
                        </div>
                        <X className='cursor-pointer text-red-500 hover:text-red-600' onClick={removeFile} />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!file || uploading}
                    className={`mt-3 w-full px-4 py-2 text-white rounded-lg text-sm ${
                        !file || uploading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    Upload file
                </button>
            </form>
        </div>
    )
}

