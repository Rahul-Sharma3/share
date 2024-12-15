"use client"
import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function DataTable({ data = [], columns = [] }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [itemsPerPage, setItemsPerPage] = useState(7)
    const router = useRouter()

    // Set items per page based on screen height
    useEffect(() => {
        const handleResize = () => {
            const screenHeight = window.innerHeight;
            // Calculate items per page based on screen height
            // Assuming each row is approximately 60px tall
            // Subtracting space for header, search bar, and pagination (approximately 250px)
            const availableHeight = screenHeight - 350;
            const calculatedItems = Math.floor(availableHeight / 60);
            
            // Set minimum of 3 items and maximum of 10 items
            setItemsPerPage(Math.min(Math.max(calculatedItems, 3), 10));
        }
        
        // Initial setup
        handleResize()
        
        // Add event listener
        window.addEventListener('resize', handleResize)
        
        // Cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Reset to page 1 when screen size changes
    useEffect(() => {
        setCurrentPage(1)
    }, [itemsPerPage])

    // Filter data based on search term
    const filteredData = data.filter(item => 
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Your Files</h1>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Upload Button */}
                    <button
                        onClick={() => router.push('/upload')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-lg border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index} className="px-4 py-3 text-left whitespace-nowrap">
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedData.map((row, rowIndex) => (
                                <tr key={row.$id || rowIndex} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                                            {column.cell 
                                                ? column.cell({ row: { original: row } })
                                                : row[column.accessorKey]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                    <div className="flex-1 text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border enabled:hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
} 