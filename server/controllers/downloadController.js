const youtubeModel = require('../models/youtubeModel');
const vimeoModel = require('../models/vimeoModel');
const identifyPlatform = require('../utils/identifyPlatform');
const contentDispositionHelper = require('../utils/contentDispositionHelper');

exports.downloadVideo = async (req, res) => {
  const { url, itag } = req.query;
  const platform = identifyPlatform(url);

  if (!platform) {
    return res.status(400).json({ error: 'Unsupported platform or invalid URL!' });
  }

  try {
    if (platform === 'youtube') {
      const stream = await youtubeModel.downloadVideo(url, itag);
      res.setHeader('Content-Disposition', contentDispositionHelper('youtube-video.mp4'));
      stream.pipe(res);
    } else if (platform === 'vimeo') {
      const stream = await vimeoModel.downloadVideo(url);
      res.setHeader('Content-Disposition', contentDispositionHelper('vimeo-video.mp4'));
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Error during download:', error);
    res.status(500).json({ error: 'Failed to download video.' });
  }
};
