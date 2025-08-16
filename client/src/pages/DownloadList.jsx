import React, { useEffect, useState } from 'react';
import { FaSpinner, FaExclamationTriangle, FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Assuming you have theme context

const DownloadPDF = () => {
  const { darkMode } = useTheme();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/download-all`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        // Get content disposition for filename
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'allotments.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        // Track download progress
        const contentLength = response.headers.get('content-length');
        const totalBytes = parseInt(contentLength || '0', 10);
        let loadedBytes = 0;

        const reader = response.body.getReader();
        const chunks = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          loadedBytes += value.length;
          
          if (totalBytes > 0) {
            setDownloadProgress(Math.round((loadedBytes / totalBytes) * 100));
          }
        }

        // Combine chunks and create blob
        const blob = new Blob(chunks, { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          setStatus('success');
        }, 100);
        
      } catch (err) {
        console.error('Download failed:', err);
        setError(err.message || 'Failed to download PDF file');
        setStatus('error');
      }
    };

    fetchPDF();

    return () => {
      // Cleanup if component unmounts during download
    };
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <FaFilePdf className="text-5xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Preparing Download</h2>
            <p className="mb-6">Your PDF file is being prepared for download...</p>
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            {downloadProgress > 0 && (
              <div className="w-full max-w-xs">
                <div className={`h-2 rounded-full ${darkMode ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm">{downloadProgress}% downloaded</p>
              </div>
            )}
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 text-center">
            <FaCheckCircle className="text-5xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Download Complete</h2>
            <p className="mb-6">The PDF file has been downloaded to your device.</p>
            <button
              onClick={() => window.location.reload()}
              className={`px-6 py-2 rounded-md font-medium ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Download Another
            </button>
          </div>
        );
      
      case 'error':
        return (
          <div className={`flex flex-col items-center justify-center min-h-screen p-6 text-center ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <FaExclamationTriangle className="text-5xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Download Failed</h2>
            <p className="mb-6 max-w-md">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className={`px-6 py-2 rounded-md font-medium ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className={`px-6 py-2 rounded-md font-medium ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Go Back
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="transition-colors duration-300">
      {renderContent()}
    </div>
  );
};

export default DownloadPDF;