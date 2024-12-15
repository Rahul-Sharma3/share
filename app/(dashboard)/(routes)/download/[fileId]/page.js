"use client"
import { useState, useEffect } from 'react'
import { fileService } from '@/app/_services/file-service'
import { Lock, Download, FileIcon, Eye, EyeOff } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { useAuth } from '@clerk/nextjs'
import 'react-toastify/dist/ReactToastify.css'

export default function DownloadFile({ params }) {
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [isPasswordVerified, setIsPasswordVerified] = useState(false)
    const { userId } = useAuth()

    useEffect(() => {
        loadFileDetails()
    }, [params.fileId])

    const loadFileDetails = async () => {
        try {
            const fileData = await fileService.getFileById(params.fileId)
            setFile(fileData)
            setIsOwner(fileData.ownerId === userId)
            if (fileData.isPublic) {
                setIsPasswordVerified(true)
            }
        } catch (error) {
            console.error('Error loading file:', error)
            setError('File not found or unavailable')
        } finally {
            setLoading(false)
        }
    }

    const verifyPassword = async () => {
        try {
            if (!password) {
                toast.error('Please enter the password')
                return
            }

            const hashedPassword = fileService.hashPassword(password)
            if (hashedPassword === file.password) {
                setIsPasswordVerified(true)
                toast.success('Password verified successfully!')
            } else {
                setPassword('')
                toast.error('Invalid password')
            }
        } catch (error) {
            console.error('Password verification error:', error)
            toast.error('Error verifying password')
        }
    }

    const handleDownload = async () => {
        try {
            const downloadInfo = await fileService.downloadFile(file.$id, password, isOwner)
            
            const link = document.createElement('a')
            link.href = downloadInfo.url
            link.download = downloadInfo.fileName || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            toast.success(`Downloading ${file.fileName}...`)
        } catch (error) {
            console.error('Download error:', error)
            toast.error('Failed to download file')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4">
                        <FileIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-center mb-6">
                        Download File
                    </h2>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900">{file?.fileName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Size: {(file?.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>

                    {file && !file.isPublic && !isOwner && !isPasswordVerified && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    <span>This file is password protected</span>
                                </div>
                            </label>
                            <div className="relative mb-4">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password to download"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={verifyPassword}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Verify Password
                            </button>
                        </div>
                    )}

                    {(file?.isPublic || isOwner || isPasswordVerified) && (
                        <button
                            onClick={handleDownload}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-lg"
                        >
                            <Download className="w-5 h-5" />
                            Download File
                        </button>
                    )}
                </div>
            </div>
            
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastStyle={{
                    backgroundColor: 'white',
                    color: '#333',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    minHeight: '64px'
                }}
            />
        </div>
    )
} 