"use client";

import React, { useState } from "react";
import { Upload, File, Shield, Send } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';

function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  const menuList = [
    {
      id: 1,
      name: "Upload",
      icon: Upload,
      path: "/upload",
    },
    {
      id: 2,
      name: "Files",
      icon: File,
      path: "/files",
    },
    {
      id: 3,
      name: "Direct Send",
      icon: Send,
      path: "/send",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: Shield,
      path: "/upgrade",
    },
  ];

  return (
    <div className='bg-white border-r shadow-sm h-full'>
      {/* Fixed height for logo container */}
      <div className="hidden md:flex h-16 px-8 border-b items-center">
        <div className="relative w-[150px] h-[50px]">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            fill
            priority // Add priority to load image immediately
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {menuList.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              className={`flex items-center gap-2 p-4 px-6 hover:bg-gray-100 w-full text-gray-500 transition-colors ${
                isActive ? 'bg-blue-100 text-blue-600' : ''
              }`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SideNav;

