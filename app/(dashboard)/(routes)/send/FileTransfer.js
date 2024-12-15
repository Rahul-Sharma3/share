// components/FileTransfer.js
'use client'
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";

const FileTransfer = ({ roomCode, isSender }) => {
    const socketRef = useRef();
    const peerConnectionRef = useRef();
    const dataChannelRef = useRef();
    const [transferStatus, setTransferStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [transferComplete, setTransferComplete] = useState(false);
    const [connectionError, setConnectionError] = useState(false);

    const successVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: { 
            opacity: 0,
            y: -20,
            transition: { duration: 0.2 }
        }
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:3001', {
            transports: ['websocket'],
            upgrade: false
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
            socketRef.current.emit('join-room', roomCode);
            setTransferStatus('Connected to server');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setTransferStatus('Connection error occurred');
            setConnectionError(true);
        });

        socketRef.current.on('user-connected', async (userId) => {
            console.log('User connected:', userId);
            await createOffer(userId);
        });

        socketRef.current.on('signal', async (data) => {
            try {
                if (data.signal.type === 'offer') {
                    await createAnswer(data);
                } else if (data.signal.type === 'answer') {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.signal));
                } else if (data.signal.candidate) {
                    const candidate = new RTCIceCandidate({
                        candidate: data.signal.candidate,
                        sdpMid: data.signal.sdpMid,
                        sdpMLineIndex: data.signal.sdpMLineIndex,
                    });
                    await peerConnectionRef.current.addIceCandidate(candidate);
                }
            } catch (error) {
                console.error('Error handling signal:', error);
                setTransferStatus('Connection error occurred');
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [roomCode]);

    const handleIceCandidate = (userId) => (event) => {
        if (event.candidate) {
            socketRef.current.emit('signal', {
                to: userId,
                signal: {
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                }
            });
        }
    };

    const createOffer = async (userId) => {
        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ]
        });

        dataChannelRef.current = peerConnectionRef.current.createDataChannel('fileTransfer');
        setupDataChannel(dataChannelRef.current);

        peerConnectionRef.current.onicecandidate = handleIceCandidate(userId);

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        socketRef.current.emit('signal', { to: userId, signal: offer });
    };

    const createAnswer = async (data) => {
        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ]
        });

        peerConnectionRef.current.ondatachannel = (event) => {
            const receiveChannel = event.channel;
            setupDataChannel(receiveChannel);
        };

        peerConnectionRef.current.onicecandidate = handleIceCandidate(data.from);

        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.signal));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socketRef.current.emit('signal', { to: data.from, signal: answer });
    };

    const sendFile = async (file) => {
        if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
            setTransferStatus('Connection not ready. Please wait...');
            return;
        }

        try {
            setTransferStatus('Starting file transfer...');
            
            // First send the file metadata
            const metadata = {
                name: file.name,
                type: file.type,
                size: file.size
            };
            dataChannelRef.current.send(JSON.stringify({ type: 'metadata', data: metadata }));

            // Then send the actual file in chunks
            const chunkSize = 16384; // 16KB chunks
            const reader = new FileReader();
            let offset = 0;

            reader.onload = (e) => {
                dataChannelRef.current.send(e.target.result);
                offset += e.target.result.byteLength;
                const progress = Math.min((offset / file.size) * 100, 100);
                setProgress(Math.round(progress));

                if (offset < file.size) {
                    // Read the next chunk
                    readChunk();
                } else {
                    setTransferStatus('File sent successfully!');
                    setTimeout(() => setProgress(0), 2000);
                }
            };

            const readChunk = () => {
                const slice = file.slice(offset, offset + chunkSize);
                reader.readAsArrayBuffer(slice);
            };

            readChunk();

        } catch (error) {
            console.error('Error sending file:', error);
            setTransferStatus('Error sending file');
        }
    };

    const setupDataChannel = (channel) => {
        channel.onopen = () => {
            console.log('Data channel is open');
            setTransferStatus('Connected - Ready to transfer');
        };

        channel.onclose = () => {
            console.log('Data channel is closed');
            setTransferStatus('Connection closed');
        };

        let receivedSize = 0;
        let fileData = [];
        let metadata = null;

        channel.onmessage = (event) => {
            try {
                if (typeof event.data === 'string') {
                    // Handle metadata
                    const message = JSON.parse(event.data);
                    if (message.type === 'metadata') {
                        metadata = message.data;
                        fileData = [];
                        receivedSize = 0;
                        setTransferStatus(`Receiving ${metadata.name}...`);
                    }
                } else {
                    // Handle file chunks
                    fileData.push(event.data);
                    receivedSize += event.data.byteLength;

                    if (metadata) {
                        const progress = Math.min((receivedSize / metadata.size) * 100, 100);
                        setProgress(Math.round(progress));

                        if (receivedSize === metadata.size) {
                            // File transfer complete
                            const blob = new Blob(fileData, { type: metadata.type });
                            const url = URL.createObjectURL(blob);
                            
                            // Create download link
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = metadata.name;
                            a.click();
                            
                            setTransferStatus('File received successfully!');
                            setTimeout(() => {
                                setProgress(0);
                                URL.revokeObjectURL(url);
                            }, 2000);
                            
                            // Reset for next transfer
                            fileData = [];
                            metadata = null;
                            receivedSize = 0;
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing received data:', error);
                setTransferStatus('Error receiving file');
            }
        };
    };

    const handleTransferSuccess = () => {
        setTransferComplete(true);
        setTimeout(() => setTransferComplete(false), 3000);
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {transferComplete && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={successVariants}
                        className="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-green-700 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        File transferred successfully!
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="bg-white rounded-lg p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {isSender ? 'Send Files' : 'Receive Files'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {transferStatus || 'Waiting for connection...'}
                            </p>
                        </div>
                        {progress > 0 && (
                            <span className="text-sm font-medium text-gray-900">
                                {progress}%
                            </span>
                        )}
                    </div>

                    {progress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {isSender ? (
                        <div className="mt-4">
                            <label
                                htmlFor="file-upload"
                                className="relative flex items-center justify-center w-full h-32 px-6 py-7 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors group"
                            >
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        />
                                    </svg>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium text-blue-600 hover:text-blue-500">
                                            Click to upload
                                        </span>
                                        {' or drag and drop'}
                                    </div>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) sendFile(file);
                                    }}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="mt-4 flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">
                                    Waiting for files...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileTransfer;
