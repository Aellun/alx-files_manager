#!/usr/bin/node

const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.alive = true;
    this.connectedPromise = this.connect();

    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
      this.alive = false; // Update alive state on error
    });

    this.client.on('ready', () => {
      // console.log('Connection to Redis successful!');
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        // console.log('Connected to Redis');
        this.alive = true; // Set alive to true on connection
        resolve();
      });

      this.client.on('error', (err) => {
        reject(new Error(`Redis connection failed: ${err.message}`)); // Reject with an Error object
      });
    });
  }

  isAlive() {
    return this.alive;
  }

  async get(key) {
    await this.connectedPromise;
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, val) => {
        if (err) {
          console.error('Error fetching from Redis:', err);
          return reject(new Error(`Error fetching key: ${err.message}`)); // Reject with an Error object
        }
        resolve(val);
      });
    });
  }

  async set(key, value, duration) {
    await this.connectedPromise;
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          console.error('Error setting value in Redis:', err);
          return reject(new Error(`Error setting value: ${err.message}`)); // Reject with an Error object
        }
        resolve(true);
      });
    });
  }

  async del(key) {
    await this.connectedPromise;
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error('Error deleting key from Redis:', err);
          return reject(new Error(`Error deleting key: ${err.message}`)); // Reject with an Error object
        }
        resolve(true);
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
