#!/usr/bin/node
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    // Checks status of Redis and database connections
    const redisAlive = redisClient.isAlive();
    const dbAlive = dbClient.isAlive();

    // Sends HTTP 200 OK with connection status
    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(req, res) {
    // Gets count of users and files from the database
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    // Sends HTTP 200 OK with stats
    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

module.exports = AppController;
