"use client";
import React, { useState } from 'react';
import SideNav from './_components/SideNav';
import TopHeader from './_components/TopHeader';
import { ChevronLeft } from 'lucide-react';
import Image from "next/image";

function Layout({ children }) {
    const [isSideNavVisible, setIsSideNavVisible] = useState(false);

    const toggleSideNav = () => {
        setIsSideNavVisible(!isSideNavVisible);
    };

    return (
        <div className="h-full relative">
            {/* Overlay for mobile */}
            {isSideNavVisible && (
                <div 
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={toggleSideNav}
                />
            )}

            {/* SideNav - Mobile */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white transform transition-all duration-300 ease-in-out z-40 ${
                isSideNavVisible ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center p-4 border-b">
                    <button 
                        onClick={toggleSideNav}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <div className="relative w-[120px] h-[40px] ml-2">
                        <Image 
                            src="/logo.svg" 
                            alt="logo" 
                            fill
                            priority
                        />
                    </div>
                </div>
                <SideNav showBackButton={false} />
            </div>

            {/* SideNav - Desktop */}
            <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white z-40">
                <SideNav />
            </div>

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen bg-white">
                <TopHeader toggleSideNav={toggleSideNav} />
                {children}
            </main>
        </div>
    );
}

export default Layout;