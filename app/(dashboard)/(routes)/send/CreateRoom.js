'use client'
import React, { useState } from "react";
import FileTransfer from './FileTransfer';
import toast from 'react-hot-toast';
import { Plus, Link as LinkIcon, X } from 'lucide-react';
import { motion } from "framer-motion";

function CreateRoom() {
    const [roomCode, setRoomCode] = useState('');
    const [isSender, setIsSender] = useState(false);
    const [showFileTransfer, setShowFileTransfer] = useState(false);

    const generateRoomCode = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setIsSender(true);
        setShowFileTransfer(true);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            setIsSender(false);
            setShowFileTransfer(true);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        toast.success('Room code copied to clipboard!', {
            style: {
                border: '1px solid #10B981',
                padding: '16px',
                color: '#064E3B',
            },
            iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
            },
        });
    };

    const handleLeaveRoom = () => {
        setShowFileTransfer(false);
        setRoomCode('');
        setIsSender(false);
    };

    const cardVariants = {
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const successAnimation = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1,
            opacity: 1,
            transition: { 
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-4 flex items-start justify-center">
            {!showFileTransfer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group border-2 border-blue-500 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden h-[400px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-500 text-blue-500">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Room</h2>
                                <p className="text-gray-600 mb-4">
                                    Start a new sharing session and get a unique room code
                                </p>
                            </div>
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={generateRoomCode}
                                className="w-full border-2 border-blue-500 text-blue-500 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Create New Room
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group border-2 border-green-500 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden h-[400px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border-2 border-green-500 text-green-500">
                                    <LinkIcon className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2 text-gray-900">Join Room</h2>
                                <p className="text-gray-600 mb-6">
                                    Enter a room code to join an existing sharing session
                                </p>
                            </div>
                            <form onSubmit={joinRoom} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter Room Code"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-colors"
                                />
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={!roomCode.trim()}
                                    className="w-full border-2 border-green-500 text-green-500 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Join Room
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={successAnimation}
                    className="border-2 border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white w-full h-[500px]"
                >
                    <div className="bg-gray-50 p-6 flex items-center justify-between border-b-2 border-gray-200">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-gray-900">Room Code:</h2>
                                <code className="text-2xl font-mono font-bold text-blue-600">
                                    {roomCode}
                                </code>
                                <button
                                    onClick={handleCopyCode}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <LinkIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {isSender ? 'Share this code with others to let them join' : 'Connected to room'}
                            </p>
                        </div>
                        <button
                            onClick={handleLeaveRoom}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <FileTransfer roomCode={roomCode} isSender={isSender} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default CreateRoom;
