#!/usr/bin/node
const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request body
app.use(express.json());

// Loads all routes
app.use('/', routes);

// Starts the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
