'use client'

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoaded, isSignedIn } = useUser();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
            <div className="mx-0 sm:mx-auto lg:mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12 py-2">
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="logo"
                                width={150}
                                height={50}
                            />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-base">
                                <li>
                                    <Link 
                                        href="/" 
                                        className="text-gray-900 font-semibold transition hover:text-blue-900/75"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/upload" 
                                        className="text-gray-900 font-semibold transition hover:text-blue-900/75"
                                    >
                                        Upload
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/about" 
                                        className="text-gray-900 font-semibold transition hover:text-blue-900/75"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/contact" 
                                        className="text-gray-900 font-semibold transition hover:text-blue-900/75"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            {!isLoaded ? (
                                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                            ) : isSignedIn ? (
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-[40px] h-[40px]"
                                        }
                                    }}
                                    afterSignOutUrl="/"
                                />
                            ) : (
                                <Link 
                                    href="/sign-in" 
                                    className="block rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        <button 
                            onClick={toggleMobileMenu}
                            className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden"
                        >
                            <span className="sr-only">Toggle menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div 
                className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div 
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                    onClick={toggleMobileMenu}
                ></div>

                <nav 
                    className={`absolute inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="p-4">
                        <button 
                            onClick={toggleMobileMenu}
                            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </button>
                        <ul className="space-y-4 mt-8">
                            <li>
                                <Link href="/" className="block text-gray-900 font-semibold hover:text-blue-900/75">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/upload" className="block text-gray-900 font-semibold hover:text-blue-900/75">
                                    Upload
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="block text-gray-900 font-semibold hover:text-blue-900/75">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="block text-gray-900 font-semibold hover:text-blue-900/75">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
