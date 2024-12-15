"use client"
import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, Mail, Copy, Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fileService } from '@/app/_services/file-service'
import { useAuth } from '@clerk/nextjs'
import {Eye, EyeOff } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function SharePage({ params }) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
    const [password, setPassword] = useState('')
    const [shareUrl, setShareUrl] = useState('')
    const router = useRouter()
    const { userId } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')

    useEffect(() => {
        loadFileDetails()
    }, [])

    const loadFileDetails = async () => {
        try {
            const fileData = await fileService.getFileById(params.fileId)
            setFile(fileData)
            setIsPasswordEnabled(!!fileData.password)
            if (fileData.password) {
                setCurrentPassword(fileData.password)
            }
            setShareUrl(`${window.location.origin}/download/${params.fileId}`)
        } catch (error) {
            console.error('Error loading file:', error)
            toast.error('Error loading file details')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordUpdate = async () => {
        try {
            if (isPasswordEnabled && !password) {
                toast.error('Please enter a password')
                return
            }

            const updatedFile = await fileService.updateFilePassword(
                params.fileId,
                isPasswordEnabled ? password : null
            )

            setFile(updatedFile)
            if (updatedFile.password) {
                setCurrentPassword(updatedFile.password)
            } else {
                setCurrentPassword('')
            }
            setPassword('')
            toast.success('Password settings updated successfully')
        } catch (error) {
            console.error('Error updating password:', error)
            toast.error('Failed to update password settings')
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            toast.success('Link copied to clipboard!')
        } catch (error) {
            toast.error('Failed to copy link')
        }
    }

    const handlePasswordProtectToggle = (enabled) => {
        if (enabled) {
            toast.warning('You are about to set password protection on your shared file')
        } else if (file && !file.isPublic) {
            toast.warning('You are about to remove password protection from your shared file')
        }
        
        setIsPasswordEnabled(enabled)
        if (!enabled) {
            setPassword('')
            setShowPassword(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="p-4 max-w-4xl mx-auto h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => router.push('/files')}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Files
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push('/upload')}
                        className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload New
                    </button>
                    <button
                        onClick={() => toast.info('Email sharing coming soon!')}
                        className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                        <Mail className="w-4 h-4 mr-1" />
                        Email Share
                    </button>
                </div>
            </div>
            
            {file && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Share File</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-base font-medium mb-1">{file.fileName}</h3>
                        <p className="text-gray-500 flex items-center text-sm">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Size: {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h3 className="text-base font-medium mb-3">Security Settings</h3>
                            <label className="flex items-center mb-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPasswordEnabled}
                                    onChange={(e) => handlePasswordProtectToggle(e.target.checked)}
                                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm">Password Protection</span>
                            </label>

                            {isPasswordEnabled && (
                                <div className="mt-3">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={currentPassword ? "Enter new password" : "Enter password"}
                                            className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {currentPassword && (
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
                                            Current password is set. Leave blank to keep current password.
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handlePasswordUpdate}
                                className="mt-3 bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                                Update Security Settings
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-medium mb-3">Share Link</h3>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                        <Link className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="w-full pl-8 p-2 text-sm border rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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