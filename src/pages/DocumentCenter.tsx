import { FileText, Folder, File, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../providers/AuthProvider';
import { useLocation } from 'react-router-dom';

interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
}

export default function DocumentCenter() {
  const { token } = useAuth();
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkGoogleDriveConnection();
    
    // Check for Google OAuth callback
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code && token) {
      handleGoogleCallback(code);
    }
  }, [location, token]);

  const handleGoogleCallback = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/google/callback`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Successfully connected to Google Drive!');
        checkGoogleDriveConnection();
      }
    } catch (error: any) {
      console.error('Error handling Google callback:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data.message || 'Failed to connect to Google Drive');
      } else {
        toast.error('Failed to connect to Google Drive');
      }
    } finally {
      setIsLoading(false);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const checkGoogleDriveConnection = async () => {
    try {
      setIsLoadingFiles(true);
      
      // Check if token exists
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access Google Drive');
        return;
      }

      console.log('Using token:', token); // For debugging

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/google/drive/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success' && response.data.files) {
        setIsConnected(true);
        setFiles(response.data.files);
      }
    } catch (error: any) {
      console.error('Error checking Google Drive connection:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Authentication failed. Please try logging in again.');
        } else {
          toast.error(error.response.data.message || 'Failed to connect to Google Drive');
        }
      }
      setIsConnected(false);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleConnectGoogleDrive = async () => {
    try {
      setIsLoading(true);
      if (!token) {
        toast.error('Please log in to connect Google Drive');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/google/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      }
    } catch (error: any) {
      console.error('Error connecting to Google Drive:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data.error || 'Failed to connect to Google Drive');
      } else {
        toast.error('Failed to connect to Google Drive');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <FileText className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-black">Document Center</h1>
            <p className="text-black/80 mt-1">
              Connect your Google Drive to access and manage your files.
            </p>
          </div>
        </div>
      </div>

      <div className="drive-integrations flex items-center gap-4 mb-8">
        <div className="drive-bx">
          <button
            onClick={handleConnectGoogleDrive}
            disabled={isLoading}
            className={`w-fit bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isConnected ? 'Connected to Google Drive' : 'Connect Google Drive'}
          </button>
        </div>
        <div className="drive-bx">
          <button disabled className='w-fit bg-white/50 rounded py-3 px-5 font-semibold uppercase flex items-center justify-center cursor-not-allowed gap-2 text-black/50'>
            Connect DropBox (Coming Soon)
          </button>
        </div>
        <div className="drive-bx">
          <button disabled className='w-fit bg-white/50 rounded py-3 px-5 font-semibold uppercase flex items-center justify-center cursor-not-allowed gap-2 text-black/50'>
            Connect OneDrive (Coming Soon)
          </button>
        </div>
      </div>

      {/* Files Display */}
      {isLoadingFiles ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      ) : isConnected && files.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Google Drive Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 border rounded-lg hover:border-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {file.mimeType.includes('folder') ? (
                    <Folder className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <File className="h-6 w-6 text-yellow-400" />
                  )}
                  <div>
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-yellow-600"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {file.mimeType.split('/').pop()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isConnected ? (
        <div className="text-center py-12 text-gray-500">
          No files found in your Google Drive
        </div>
      ) : null}
    </div>
  );
} 