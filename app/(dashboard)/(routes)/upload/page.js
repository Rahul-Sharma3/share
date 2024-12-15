"use client"
import React, { useState } from 'react'
import UploadForm from './_components/UploadForm'
import { Check, ArrowLeft, Upload as UploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

function Upload() {
  const [progress, setProgress] = useState(0)
  const [isUploaded, setIsUploaded] = useState(false)
  const router = useRouter()
  
  const uploadFile = (file, fileId) => {
    try {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploaded(true)
          setTimeout(() => {
            router.push(`/share/${fileId}`)
          }, 1500)
        }
      }, 200)
    } catch (error) {
      console.error("Error starting upload:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push('/files')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Files
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <UploadIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">
              Start <span className="text-blue-600">Uploading</span> File and <span className="text-blue-600">Share</span> it
            </h2>
          </div>
          <p className="text-center text-gray-500 text-sm">
            Upload your files securely and share them with others
          </p>
        </div>

        {/* Upload Content */}
        <div className="p-6">
          {isUploaded ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-500">
                Redirecting to share page...
              </p>
            </div>
          ) : (
            <div>
              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>All file types supported</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Up to 100MB per file</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Secure file sharing</span>
                </div>
              </div>

              {/* Upload Form Component */}
              <UploadForm 
                uploadBtnClick={uploadFile} 
                progress={progress} 
              />

              {/* Progress Bar */}
              {progress > 0 && progress < 100 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uploading...</span>
                    <span className="text-gray-900 font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Your files are encrypted and secure
      </div>
    </div>
  )
}

export default Upload
