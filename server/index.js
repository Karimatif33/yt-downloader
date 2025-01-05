// const express = require('express');
// const cors = require('cors');
// const ytdl = require('@distube/ytdl-core');
// const axios = require('axios');
// const contentDisposition = require('content-disposition');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 4000;

// app.use(cors());
// app.use(express.json());

// const identifyPlatform = (url) => {
//   if (ytdl.validateURL(url)) return 'youtube';
//   if (url.includes('vimeo.com')) return 'vimeo';
//   return null;
// };

// // Fetch formats
// app.get('/formats', async (req, res) => {
//   const videoURL = req.query.url;
//   const platform = identifyPlatform(videoURL);

//   if (!platform) {
//     return res.status(400).json({ error: 'Unsupported platform or invalid URL!' });
//   }

//   try {
//     let formats = [];
//     if (platform === 'youtube') {
//       const ytInfo = await ytdl.getInfo(videoURL);
//       formats = ytInfo.formats.map((format) => ({
//         itag: format.itag,
//         quality: format.qualityLabel || 'Audio+Video',
//         size: format.contentLength
//           ? `${(Number(format.contentLength) / (1024 * 1024)).toFixed(2)} MB`
//           : 'Unknown',
//         type: format.hasVideo && format.hasAudio ? 'Video+Audio' : 'Video',
//         format: format.container,
//       }));
//     } else if (platform === 'vimeo') {
//       const videoId = videoURL.split('/').pop();
//       const vimeoInfo = await axios.get(`https://vimeo.com/api/v2/video/${videoId}.json`);
//       const vimeoVideo = vimeoInfo.data[0];

//       if (vimeoVideo.download.length) {
//         formats = vimeoVideo.download.map((file) => ({
//           quality: file.quality,
//           size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//           format: file.mime,
//           url: file.link,
//         }));
//       }
//     }

//     res.status(200).json({ success: true, formats });
//   } catch (error) {
//     console.error(`Error fetching formats for ${platform}:`, error);
//     res.status(500).json({ error: 'Error fetching video formats.' });
//   }
// });

// // Download endpoint
// app.get('/download', async (req, res) => {
//   const { url, itag } = req.query;

//   const platform = identifyPlatform(url);

//   if (!platform) {
//     return res.status(400).send({ error: 'Unsupported platform or invalid URL!' });
//   }

//   try {
//     if (platform === 'youtube') {
//       if (!itag) return res.status(400).json({ error: 'itag is required for YouTube.' });

//       const ytInfo = await ytdl.getInfo(url);
//       const ytFormat = ytInfo.formats.find((f) => f.itag == itag);

//       if (!ytFormat) return res.status(400).send({ error: 'Format not found for YouTube.' });

//       res.setHeader('Content-Disposition', contentDisposition(`${ytInfo.videoDetails.title}.mp4`));
//       ytdl(url, { format: ytFormat }).pipe(res);
//     } else if (platform === 'vimeo') {
//       const videoId = url.split('/').pop();
//       const vimeoInfo = await axios.get(`https://vimeo.com/api/v2/video/${videoId}.json`);
//       const vimeoVideo = vimeoInfo.data[0];

//       if (!vimeoVideo || !vimeoVideo.download.length) {
//         return res.status(404).json({ error: 'No downloadable formats found for Vimeo video.' });
//       }

//       const downloadUrl = vimeoVideo.download[0].link;
//       res.setHeader('Content-Disposition', contentDisposition(`${vimeoVideo.title}.mp4`));
//       axios.get(downloadUrl, { responseType: 'stream' }).then((stream) => stream.data.pipe(res));
//     }
//   } catch (error) {
//     console.error(`Error during download for ${platform}:`, error);
//     res.status(500).send({ error: 'Error during video download.' });
//   }
// });







// // Fetch playlist details
// app.get('/playlist', async (req, res) => {
//   const playlistURL = req.query.url;

//   // Validate the URL
//   if (!ytpl.validateID(playlistURL)) {
//     return res.status(400).json({ error: 'Invalid YouTube playlist URL!' });
//   }

//   try {
//     const playlist = await ytpl(playlistURL, { limit: 50 }); // Fetch up to 50 videos
//     const videos = playlist.items.map((video) => ({
//       title: video.title,
//       url: video.shortUrl,
//       duration: video.duration,
//       id: video.id,
//     }));

//     res.status(200).json({
//       title: playlist.title,
//       totalVideos: playlist.total_items,
//       videos,
//     });
//   } catch (error) {
//     console.error('Error fetching playlist:', error);
//     res.status(500).json({ error: 'Failed to fetch playlist data.' });
//   }
// });

// // Download a single video from the playlist
// app.get('/playlist/download', async (req, res) => {
//   const { videoUrl, itag } = req.query;

//   if (!ytdl.validateURL(videoUrl)) {
//     return res.status(400).json({ error: 'Invalid YouTube video URL!' });
//   }

//   try {
//     const ytInfo = await ytdl.getInfo(videoUrl);
//     const ytFormat = ytInfo.formats.find((f) => f.itag == itag);

//     if (!ytFormat) {
//       return res.status(404).json({ error: 'Format not found for this video.' });
//     }

//     res.setHeader('Content-Disposition', contentDisposition(`${ytInfo.videoDetails.title}.mp4`));
//     ytdl(videoUrl, { format: ytFormat }).pipe(res);
//   } catch (error) {
//     console.error('Error during video download:', error);
//     res.status(500).json({ error: 'Failed to download video.' });
//   }
// });




// app.listen(port, () => console.log(`Server is running on port ${port}`));
