import React, { useState, useRef, useEffect } from 'react';
import { File as FileIcon, Shield, Clock, Upload, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const SecureUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const data = searchParams.get('data');

  useEffect(() => {
    if (!data) {
      setIsValidLink(false);
      toast.error('Invalid upload link');
    }
  }, [data]);

  const handleBrowseClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const files = Array.from(droppedFiles);
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number): void => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async (): Promise<void> => {
    if (!data) {
      toast.error('Invalid upload link');
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('unique_string', data);
      
      // Append each file to FormData
      uploadedFiles.forEach((file) => {
        formData.append('files[]', file);
      });

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const responseData = await response.json();
      console.log('Upload response:', responseData);
      
      toast.success(responseData.message || 'Files uploaded successfully!');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20 text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Invalid Upload Link
          </h1>
          <p className="text-gray-400 mb-6">
            This upload link is invalid or has expired. Please contact your administrator to request a new secure upload link.
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-400/60 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure Document Exchange</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-zinc-900 border-b border-yellow-400/20 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div className="text-xl font-bold text-white tracking-tight">
              ISO<span className="text-yellow-400">Hub</span>
            </div>
          </div>
          <div className="text-sm text-yellow-400/60">
            Secure Document Exchange
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-4">
                Upload Your Documents
              </h1>
              <p className="text-gray-400 mb-6">
                Your documents will be securely transferred and automatically deleted after 180 days.
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span>End-to-end encrypted file transfer</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Files automatically deleted after 180 days</span>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-yellow-400/20 rounded-lg p-8 text-center mb-8"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FileIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Drag and drop your files here, or click to select files
              </p>
              <button
                onClick={handleBrowseClick}
                className="bg-yellow-400 rounded py-2 px-6 font-semibold text-black hover:bg-yellow-500 transition-colors"
              >
                Select Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>

            {/* Selected Files */}
            {uploadedFiles.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Selected Files</h2>
                <div className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-zinc-800 rounded p-3">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {uploadedFiles.length > 0 && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-yellow-400 rounded py-3 font-semibold text-black hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Files
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecureUpload; 