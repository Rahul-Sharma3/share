"use client";
import React, { useState } from 'react';
import { AlignJustify, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

function TopHeader({ toggleSideNav }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoaded } = useUser();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className='sticky top-0 flex flex-col px-5 bg-white z-20 border-b'>
            <div className='flex items-center justify-between h-16'>
                <button 
                    onClick={toggleSideNav}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle Sidebar"
                >
                    <AlignJustify className="h-6 w-6 text-gray-600" />
                </button>

                <button 
                    onClick={toggleMenu}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    aria-label="Toggle Menu"
                >
                    <span className="mr-1">Menu</span>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/upload" className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        Upload
                    </Link>
                    <Link href="/about" className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        Contact Us
                    </Link>
                </nav>

                <div className="w-[40px] h-[40px] flex items-center justify-center">
                    {!isLoaded ? (
                        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    ) : (
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "w-[40px] h-[40px]"
                                }
                            }} 
                            afterSignOutUrl="/" 
                        />
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="md:hidden py-2 border-t">
                    <Link 
                        href="/" 
                        className="block px-2 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Home
                    </Link>
                    <Link 
                        href="/upload" 
                        className="block px-2 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Upload
                    </Link>
                    <Link 
                        href="/about" 
                        className="block px-2 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        About Us
                    </Link>
                    <Link 
                        href="/contact" 
                        className="block px-2 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Contact Us
                    </Link>
                </nav>
            )}
        </div>
    );
}

export default TopHeader;
