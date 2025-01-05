const express = require('express');
const playlistController = require('../controllers/playlistController');
const router = express.Router();

router.get('/', playlistController.getPlaylistDetails);

module.exports = router;
