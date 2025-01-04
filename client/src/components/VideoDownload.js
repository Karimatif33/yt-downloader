import React, { useState } from 'react';
import axios from 'axios';

const VideoDownload = () => {
  const [videoURL, setVideoURL] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedItag, setSelectedItag] = useState('');
  const [videoName, setVideoName] = useState('');
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadController, setDownloadController] = useState(null); // For pausing or canceling the download

  // Fetch video formats from the backend
  const fetchFormats = async () => {
    if (!videoURL) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    setError('');
    setFormats([]);

    try {
      const response = await axios.get('http://localhost:4000/formats', {
        params: { url: videoURL },
      });

      if (response.data.formats && response.data.formats.length > 0) {
        setFormats(response.data.formats);
        setVideoName(response.data.videoTitle || 'video'); // Set the default video name from the API
      } else {
        setError('No valid formats found for this video.');
      }
    } catch (err) {
      setError('Failed to fetch formats. Please check the YouTube URL.');
      setFormats([]);
    }
  };

  // Handle the download action
  const handleDownload = () => {
    if (!selectedItag) {
      setError('Please select a format.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    const controller = new AbortController(); // Create an AbortController to manage cancellation
    setDownloadController(controller);

    axios
      .get('http://localhost:4000/download', {
        params: {
          url: videoURL,
          itag: selectedItag,
        },
        responseType: 'blob',
        signal: controller.signal,
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setDownloadProgress((progressEvent.loaded / progressEvent.total) * 100);
          }
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'video/mp4' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = videoName || 'video.mp4'; // Use the user-defined video name or default to 'video.mp4'
        link.click();
      })
      .catch((err) => {
        if (err.message === 'canceled') {
          setError('Download was canceled.');
        } else {
          setError('Error during video download: ' + (err.response ? err.response.data.error : err.message));
        }
      })
      .finally(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      });
  };

  // Handle the cancel download action
  const handleCancelDownload = () => {
    if (downloadController) {
      downloadController.abort(); // Abort the download process
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Download YouTube Video</h1>

      <div className="mb-4">
        <label htmlFor="videoURL" className="block text-lg font-medium mb-2">YouTube Video URL</label>
        <input
          type="url"
          id="videoURL"
          value={videoURL}
          onChange={(e) => {
            setVideoURL(e.target.value);
            setFormats([]); // Clear formats when URL changes
            setSelectedItag(''); // Clear selected format
            setDownloadProgress(0); // Reset download progress
            setError(''); // Clear any existing errors
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter YouTube URL"
        />
      </div>

      <button
        onClick={fetchFormats}
        className="bg-blue-500 text-white px-6 py-2 rounded-md mb-4"
        disabled={isDownloading || !videoURL}
      >
        {isDownloading ? 'Fetching Formats...' : 'Fetch Formats'}
      </button>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {formats.length > 0 && (
        <div className="mb-4">
          <label htmlFor="format" className="block text-lg font-medium mb-2">Select Format</label>
          <select
            id="format"
            value={selectedItag}
            onChange={(e) => setSelectedItag(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a format</option>
            {formats.map((format) => (
              <option
                key={`${format.itag}-${format.type}-${format.quality}-${format.container}`}
                value={format.itag}
              >
                {format.quality} - {format.type} ({format.contentLength})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="videoName" className="block text-lg font-medium mb-2">Video Name</label>
        <input
          type="text"
          id="videoName"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter custom video name"
        />
      </div>

      {isDownloading && (
        <div className="mb-4">
          <p className="text-center mb-2">Download Progress: {Math.round(downloadProgress)}%</p>
          <div className="w-full bg-gray-300 rounded-md">
            <div
              className="bg-blue-500 h-2 rounded-md"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-green-500 text-white px-6 py-2 rounded-md"
        disabled={!selectedItag || isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download Video'}
      </button>

      {isDownloading && (
        <button
          onClick={handleCancelDownload}
          className="bg-red-500 text-white px-6 py-2 rounded-md ml-4"
        >
          Cancel Download
        </button>
      )}
    </div>
  );
};

export default VideoDownload;
