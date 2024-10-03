#!/usr/bin/node
const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

// Route for checking the status
router.get('/status', AppController.getStatus);

// Route for checking stats
router.get('/stats', AppController.getStats);

module.exports = router;
