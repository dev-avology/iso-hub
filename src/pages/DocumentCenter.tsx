import { FileText, Folder, File, Loader2, LogOut } from 'lucide-react';
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

interface DropboxFile {
  '.tag': string;
  name: string;
  path_lower: string;
  id: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  size: number;
  is_downloadable: boolean;
  content_hash: string;
}

interface OneDriveFile {
  id: string;
  name: string;
  webUrl: string;
  size?: number;
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
}

type StorageService = 'google' | 'dropbox' | 'onedrive';

export default function DocumentCenter() {
  const { token } = useAuth();
  const [googleFiles, setGoogleFiles] = useState<GoogleFile[]>([]);
  const [dropboxFiles, setDropboxFiles] = useState<DropboxFile[]>([]);
  const [onedriveFiles, setOnedriveFiles] = useState<OneDriveFile[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);
  const [isOnedriveConnected, setIsOnedriveConnected] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDropboxLoading, setIsDropboxLoading] = useState(false);
  const [isOnedriveLoading, setIsOnedriveLoading] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [activeTab, setActiveTab] = useState<StorageService>('google');
  const location = useLocation();

  useEffect(() => {
    checkGoogleDriveConnection();
    checkDropboxConnection();
    checkOnedriveConnection();
    
    // Check for OAuth callbacks
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const scope = params.get('scope');
    
    console.log('OAuth callback detected:', { code, state, scope, location: location.search });
    
    if (code && token) {
      if (state === 'dropbox') {
        console.log('Handling Dropbox callback');
        handleDropboxCallback(code);
      } else if (state === 'onedrive') {
        console.log('Handling OneDrive callback');
        handleOnedriveCallback(code);
      } else if (scope?.includes('googleapis.com')) {
        console.log('Handling Google callback');
        handleGoogleCallback(code);
      } else {
        console.error('Unknown callback type:', { state, scope });
        toast.error('Invalid callback type');
      }
    }
  }, [location, token]);

  const handleGoogleCallback = async (code: string) => {
    try {
      setIsGoogleLoading(true);
      console.log('Sending Google callback request to backend');
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

      console.log('Google callback response:', response.data);

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
      setIsGoogleLoading(false);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleDropboxCallback = async (code: string) => {
    try {
      setIsDropboxLoading(true);
      console.log('Sending Dropbox callback request to backend with code:', code);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/dropbox/callback`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Dropbox callback response:', response.data);

      if (response.data.status === 'success') {
        toast.success('Successfully connected to Dropbox!');
        checkDropboxConnection();
      } else {
        console.error('Dropbox callback failed:', response.data);
        toast.error(response.data.message || 'Failed to connect to Dropbox');
      }
    } catch (error: any) {
      console.error('Error handling Dropbox callback:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        toast.error(error.response.data.message || 'Failed to connect to Dropbox');
      } else {
        toast.error('Failed to connect to Dropbox');
      }
    } finally {
      setIsDropboxLoading(false);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const handleOnedriveCallback = async (code: string) => {
    try {
      setIsOnedriveLoading(true);
      console.log('Sending OneDrive callback request to backend with code:', code);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/onedrive/callback`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('OneDrive callback response:', response.data);

      if (response.data.status === 'success') {
        toast.success('Successfully connected to OneDrive!');
        checkOnedriveConnection();
      } else {
        console.error('OneDrive callback failed:', response.data);
        toast.error(response.data.message || 'Failed to connect to OneDrive');
      }
    } catch (error: any) {
      console.error('Error handling OneDrive callback:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        toast.error(error.response.data.message || 'Failed to connect to OneDrive');
      } else {
        toast.error('Failed to connect to OneDrive');
      }
    } finally {
      setIsOnedriveLoading(false);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const checkGoogleDriveConnection = async () => {
    try {
      setIsLoadingFiles(true);
      
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access Google Drive');
        return;
      }

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
        setIsGoogleConnected(true);
        setGoogleFiles(response.data.files);
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
      setIsGoogleConnected(false);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const checkDropboxConnection = async () => {
    try {
      setIsLoadingFiles(true);
      
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access Dropbox');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dropbox/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success' && response.data.files) {
        setIsDropboxConnected(true);
        setDropboxFiles(response.data.files);
      }
    } catch (error: any) {
      console.error('Error checking Dropbox connection:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Authentication failed. Please try logging in again.');
        } else {
          toast.error(error.response.data.message || 'Failed to connect to Dropbox');
        }
      }
      setIsDropboxConnected(false);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const checkOnedriveConnection = async () => {
    try {
      setIsLoadingFiles(true);
      
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to access OneDrive');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/onedrive/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success' && response.data.files) {
        setIsOnedriveConnected(true);
        setOnedriveFiles(response.data.files);
      }
    } catch (error: any) {
      console.error('Error checking OneDrive connection:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Authentication failed. Please try logging in again.');
        } else {
          toast.error(error.response.data.message || 'Failed to connect to OneDrive');
        }
      }
      setIsOnedriveConnected(false);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleConnectGoogleDrive = async () => {
    try {
      setIsGoogleLoading(true);
      if (!token) {
        toast.error('Please log in to connect Google Drive');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/google/redirect`,
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
        toast.error(error.response.data.message || 'Failed to connect to Google Drive');
      } else {
        toast.error('Failed to connect to Google Drive');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleConnectDropbox = async () => {
    try {
      setIsDropboxLoading(true);
      if (!token) {
        toast.error('Please log in to connect Dropbox');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dropbox/redirect`,
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
      console.error('Error connecting to Dropbox:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data.message || 'Failed to connect to Dropbox');
      } else {
        toast.error('Failed to connect to Dropbox');
      }
    } finally {
      setIsDropboxLoading(false);
    }
  };

  const handleConnectOnedrive = async () => {
    try {
      setIsOnedriveLoading(true);
      if (!token) {
        toast.error('Please log in to connect OneDrive');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/onedrive/redirect`,
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
      console.error('Error connecting to OneDrive:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data.message || 'Failed to connect to OneDrive');
      } else {
        toast.error('Failed to connect to OneDrive');
      }
    } finally {
      setIsOnedriveLoading(false);
    }
  };

  const handleDisconnect = async (service: StorageService) => {
    try {
      if (service === 'google') {
        setIsGoogleLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/google/disconnect`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.status === 'success') {
          setIsGoogleConnected(false);
          setGoogleFiles([]);
          toast.success('Successfully disconnected from Google Drive');
        }
      } else if (service === 'dropbox') {
        setIsDropboxLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/dropbox/disconnect`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.status === 'success') {
          setIsDropboxConnected(false);
          setDropboxFiles([]);
          toast.success('Successfully disconnected from Dropbox');
        }
      } else if (service === 'onedrive') {
        setIsOnedriveLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/onedrive/disconnect`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data.status === 'success') {
          setIsOnedriveConnected(false);
          setOnedriveFiles([]);
          toast.success('Successfully disconnected from OneDrive');
        }
      }
    } catch (error: any) {
      console.error(`Error disconnecting from ${service}:`, error);
      if (error.response) {
        toast.error(error.response.data.message || `Failed to disconnect from ${service}`);
      } else {
        toast.error(`Failed to disconnect from ${service}`);
      }
    } finally {
      if (service === 'google') {
        setIsGoogleLoading(false);
      } else if (service === 'dropbox') {
        setIsDropboxLoading(false);
      } else if (service === 'onedrive') {
        setIsOnedriveLoading(false);
      }
    }
  };

  const renderStorageContent = () => {
    if (isLoadingFiles) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      );
    }

    if (activeTab === 'google') {
      if (!isGoogleConnected) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Connect to Google Drive to view your files</p>
            <button
              onClick={handleConnectGoogleDrive}
              disabled={isGoogleLoading}
              className={`bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black mx-auto ${
                isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGoogleLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              Connect Google Drive
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Google Drive Files</h2>
            <button
              onClick={() => handleDisconnect('google')}
              disabled={isGoogleLoading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              Disconnect
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {googleFiles.map((file) => (
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
      );
    }

    if (activeTab === 'dropbox') {
      if (!isDropboxConnected) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Connect to Dropbox to view your files</p>
            <button
              onClick={handleConnectDropbox}
              disabled={isDropboxLoading}
              className={`bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black mx-auto ${
                isDropboxLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDropboxLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              Connect Dropbox
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Dropbox Files</h2>
            <button
              onClick={() => handleDisconnect('dropbox')}
              disabled={isDropboxLoading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              Disconnect
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dropboxFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 border rounded-lg hover:border-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {file['.tag'] === 'folder' ? (
                    <Folder className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <File className="h-6 w-6 text-yellow-400" />
                  )}
                  <div>
                    <a
                      href={`https://www.dropbox.com/home${file.path_lower}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-yellow-600"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {file['.tag'] === 'file' ? 'File' : 'Folder'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'onedrive') {
      if (!isOnedriveConnected) {
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Connect to OneDrive to view your files</p>
            <button
              onClick={handleConnectOnedrive}
              disabled={isOnedriveLoading}
              className={`bg-white rounded py-3 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black mx-auto ${
                isOnedriveLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isOnedriveLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              Connect OneDrive
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your OneDrive Files</h2>
            <button
              onClick={() => handleDisconnect('onedrive')}
              disabled={isOnedriveLoading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              Disconnect
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onedriveFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 border rounded-lg hover:border-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {file.folder ? (
                    <Folder className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <File className="h-6 w-6 text-yellow-400" />
                  )}
                  <div>
                    <a
                      href={file.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-yellow-600"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {file.folder ? 'Folder' : file.file?.mimeType.split('/').pop() || 'File'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
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
              Access and manage your files from various cloud storage services.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('google')}
            className={`${
              activeTab === 'google'
                ? 'border-yellow-400 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Google Drive
          </button>
          <button
            onClick={() => setActiveTab('dropbox')}
            className={`${
              activeTab === 'dropbox'
                ? 'border-yellow-400 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Dropbox
          </button>
          <button
            onClick={() => setActiveTab('onedrive')}
            className={`${
              activeTab === 'onedrive'
                ? 'border-yellow-400 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            OneDrive
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderStorageContent()}
      </div>
    </div>
  );
} 