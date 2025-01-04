import React, { useState } from 'react';
import { getVideoFormats } from '../utils/api';

const VideoFormats = () => {
  const [url, setUrl] = useState('');
  const [formats, setFormats] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await getVideoFormats(url);
      setFormats(data.formats);
      setError('');
    } catch (err) {
      setError('Failed to fetch formats.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Get Video Formats</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Fetch Formats
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      <ul className="mt-4 space-y-2">
        {formats.map((format) => (
          <li key={format.itag}>
            <span>{format.quality} - {format.type} - {format.size}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoFormats;
