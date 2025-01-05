const axios = require('axios');

exports.getFormats = async (url) => {
  const videoId = url.split('/').pop();
  const response = await axios.get(`https://vimeo.com/api/v2/video/${videoId}.json`);
  return response.data[0].download.map((file) => ({
    quality: file.quality,
    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    format: file.mime,
    url: file.link,
  }));
};

exports.downloadVideo = async (url) => {
  const videoId = url.split('/').pop();
  const response = await axios.get(`https://vimeo.com/api/v2/video/${videoId}.json`);
  const downloadUrl = response.data[0].download[0].link;
  return axios.get(downloadUrl, { responseType: 'stream' });
};
