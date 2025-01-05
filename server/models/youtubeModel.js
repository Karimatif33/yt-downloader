const ytdl = require('@distube/ytdl-core');
const ytpl = require('ytpl');

exports.getFormats = async (url) => {
  const info = await ytdl.getInfo(url);
  console.log(info.formats,"info.formats")
  // console.log(info,"info")
  return info.formats.map((format) => ({
    itag: format.itag,
    quality: format.qualityLabel ,
    size: format.contentLength ? `${(Number(format.contentLength) / (1024 * 1024)).toFixed(2)} MB` : 'Unknown',
    type: format.hasVideo && format.hasAudio ? 'Video+Audio' : 'Video',
    format: format.container,
  }));
};

exports.validatePlaylist = (url) => ytpl.validateID(url);

exports.getPlaylistDetails = async (url) => {
  const playlist = await ytpl(url, { limit: 50 });
  return {
    title: playlist.title,
    totalVideos: playlist.total_items,
    videos: playlist.items.map((video) => ({
      title: video.title,
      url: video.shortUrl,
      duration: video.duration,
    })),
  };
};

exports.downloadVideo = (url, itag) => ytdl(url, { filter: (format) => format.itag == itag });
