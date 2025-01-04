import React from 'react';
import ContactForm from './components/ContactForm';
import VideoFormats from './components/VideoFormats';
import VideoMetadata from './components/VideoMetadata';
import VideoDownload from './components/VideoDownload';

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">YouTube Downloader</h1>
      <div className="space-y-8">
        {/* <ContactForm />
        <VideoFormats />
        <VideoMetadata /> */}
        <VideoDownload />

      </div>
    </div>
  );
};

export default App;
