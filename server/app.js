const express = require('express');
const cors = require('cors');
const formatsRoutes = require('./routes/formatsRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const downloadRoutes = require('./routes/downloadRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/formats', formatsRoutes);
app.use('/playlist', playlistRoutes);
app.use('/download', downloadRoutes);

module.exports = app;
