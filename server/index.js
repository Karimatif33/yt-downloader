const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const { google } = require('googleapis');
const contentDisposition = require('content-disposition');
const dotenv = require('dotenv');
// const { sendMail } = require('./sendMail'); // Uncomment if needed for contact form

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.listen(port, () => console.log(`Server is running on port ${port}`));

/**
 * Contact Form API - Uncomment if using the contact form
 */
// app.post('/contact', async (req, res) => {
//   try {
//     const { email, issueType, description } = req.body;
//     if (!email || !issueType || !description) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const mailOptions = {
//       from: `"YouTubdle.com" ${process.env.MAIL_USER}`,
//       to: process.env.MAIL_TO,
//       subject: "YouTubdle.com Form",
//       replyTo: email,
//       text: `Message from: ${email}\n\n${description}`,
//     };

//     const result = await sendMail(mailOptions);

//     if (result.success) {
//       res.json({ success: true, message: 'Your message was successfully sent.' });
//     } else {
//       res.status(500).json({ success: false, message: 'Failed to send your message.' });
//     }
//   } catch (error) {
//     console.error('Error while sending the email:', error);
//     res.status(500).send('An error occurred while sending the email.');
//   }
// });

/**
 * Get Available Formats for a Video
 */
app.get('/formats', async (req, res) => {
  const videoURL = req.query.url;
  console.log('Fetching formats for video URL:', videoURL);

  // Validate YouTube URL
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ success: false, error: 'Invalid YouTube URL!' });
  }

  try {
    // Get video info
    const info = await ytdl.getInfo(videoURL);
    const formats = info.formats
      .filter(format => (format.hasVideo && format.hasAudio) || format.hasVideo) // Only formats with video and audio or video-only
      .map(format => ({
        itag: format.itag,
        quality: format.qualityLabel || 'Audio+Video',
        container: format.container,
        type: 'Video+Audio',
        size: format.contentLength
          ? `${(Number(format.contentLength) / (1024 * 1024)).toFixed(2)} MB`
          : 'Unknown',
        resolution: format.qualityLabel,
        format: format.container,
      }))
      .filter(format => ['mp4', 'mkv'].includes(format.format)); // Only mp4 and mkv formats

    if (formats.length === 0) {
      return res.status(404).json({ success: false, error: 'No valid video and audio formats found for this video.' });
    }

    res.status(200).json({ success: true, formats });
  } catch (error) {
    console.error('Error while getting the formats:', error);
    res.status(500).json({ success: false, error: 'Error fetching video formats.' });
  }
});


/**
 * Get Metadata for a Video
 */
app.get('/metainfo', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateID(url) && !ytdl.validateURL(url)) {
    return res.status(400).json({ success: false, error: 'Invalid YouTube ID or URL!' });
  }

  try {
    const result = await ytdl.getInfo(url);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ success: false, error: 'Error fetching video metadata.' });
  }
});

/**
 * Download Video with Selected Format
 */
app.get('/watch', async (req, res) => {
  const { v: url, itag } = req.query;

  console.log('Download request for video:', url, 'with itag:', itag);

  // Validate URL and itag
  if (!url || !itag || (!ytdl.validateID(url) && !ytdl.validateURL(url))) {
    return res.status(400).json({ success: false, error: 'Invalid YouTube ID or itag!' });
  }

  try {
    // Fetch video info
    const info = await ytdl.getBasicInfo(url);
    const { videoDetails: { title }, formats } = info;

    // Log formats to see what is returned
    console.log('Available formats:', formats);

    // Check if formats are undefined or empty
    if (!formats || formats.length === 0) {
      return res.status(400).json({ success: false, error: 'No available formats found for this video.' });
    }

    // Find the format matching the requested itag
    const format = formats.find(f => f.itag == itag);

    if (!format) {
      return res.status(400).json({ success: false, error: 'Selected format not available.' });
    }

    console.log('Downloading video:', title, 'with itag:', itag);

    // Set the content-disposition header to download the video
    res.setHeader('Content-Disposition', contentDisposition(`${title}.mp4`));

    // Stream the video to the client
    ytdl(url, { format }).pipe(res);
  } catch (error) {
    console.error('Error during video download:', error);
    res.status(500).json({ success: false, error: 'Error during video download' });
  }
});
/**
 * Download Video with Selected Format
 */
app.get('/download', async (req, res) => {
  const { url, itag } = req.query;

  console.log('Download parameters:', { url, itag }); // Log incoming params

  if (!url || !itag) {
    return res.status(400).send({ error: 'URL and itag are required' });
  }

  try {
    // Validate URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).send({ error: 'Invalid YouTube URL' });
    }

    // Fetch video info
    const info = await ytdl.getInfo(url);
    const format = info.formats.find(f => f.itag === parseInt(itag));

    if (!format) {
      return res.status(400).send({ error: 'Format not found' });
    }

    // Dynamically set the filename using the video title
    const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_'); // Remove invalid characters for filenames
    const fileName = `${videoTitle}.${format.container}`;

    // Set the content-disposition header to prompt user to download the video
    res.setHeader('Content-Disposition', contentDisposition(fileName));

    // Stream the video to the client
    ytdl(url, {
      format,
    }).pipe(res);
  } catch (error) {
    console.error('Error during download:', error);
    return res.status(500).send({ error: 'Failed to download video.' });
  }
});




app.use((req, res, next) => {
  console.log(req.headers); // Log incoming headers
  next();
});

