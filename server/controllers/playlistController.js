const youtubeModel = require('../models/youtubeModel');

exports.getPlaylistDetails = async (req, res) => {
  const playlistURL = req.query.url;

  if (!youtubeModel.validatePlaylist(playlistURL)) {
    return res.status(400).json({ error: 'Invalid YouTube playlist URL!' });
  }

  try {
    const playlist = await youtubeModel.getPlaylistDetails(playlistURL);
    res.status(200).json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Failed to fetch playlist data.' });
  }
};
