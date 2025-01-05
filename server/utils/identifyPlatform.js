const ytdl = require('@distube/ytdl-core');

module.exports = (url) => {
  if (ytdl.validateURL(url)) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  return null;
};
