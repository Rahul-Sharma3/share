"use client"
import React from 'react';

export default function RouteLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 
          rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin-reverse" />
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
} 