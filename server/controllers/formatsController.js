const youtubeModel = require('../models/youtubeModel');
const vimeoModel = require('../models/vimeoModel');
const identifyPlatform = require('../utils/identifyPlatform');

exports.getFormats = async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) {
    return res.status(400).json({ error: 'URL is required!' });
  }

  const platform = identifyPlatform(videoURL);

  if (!platform) {
    return res.status(400).json({ error: 'Unsupported platform or invalid URL!' });
  }

  try {
    let formats;
    switch (platform) {
      case 'youtube':
        try {
          formats = await youtubeModel.getFormats(videoURL);
        } catch (error) {
          console.error('Error fetching YouTube formats:', error);
          return res.status(500).json({ error: 'Error fetching YouTube video formats. The issue might be with YouTube signature extraction.' });
        }
        break;
      case 'vimeo':
        formats = await vimeoModel.getFormats(videoURL);
        break;
      default:
        return res.status(400).json({ error: 'Platform not supported' });
    }

    res.status(200).json({ success: true, formats });
  } catch (error) {
    console.error('Error fetching formats:', error);
    res.status(500).json({ error: 'Error fetching video formats.' });
  }
};
