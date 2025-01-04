import React, { useState } from 'react';
import { getVideoMetadata } from '../utils/api';

const VideoMetadata = () => {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await getVideoMetadata(url);
      setMetadata(data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch video metadata.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Video Metadata</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Get Metadata
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {metadata && (
        <div className="mt-4">
          <p><strong>Title:</strong> {metadata.videoDetails.title}</p>
          <p><strong>Duration:</strong> {metadata.videoDetails.lengthSeconds} seconds</p>
          <p><strong>Views:</strong> {metadata.videoDetails.viewCount}</p>
        </div>
      )}
    </div>
  );
};

export default VideoMetadata;
