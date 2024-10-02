#!/usr/bin/node

const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.alive = true;
    this.connectedPromise = this.connect(); // Store the connection promise

    // Handle connection events
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
        reject(err); // Reject the promise on error
      });
    });
  }

  isAlive() {
    return this.alive;
  }

  async get(key) {
    await this.connectedPromise; // Ensure connection is established
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, val) => {
        if (err) {
          console.error('Error fetching from Redis:', err);
          return reject(null);
        }
        resolve(val);
      });
    });
  }

  async set(key, value, duration) {
    await this.connectedPromise; // Ensure connection is established
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          console.error('Error setting value in Redis:', err);
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async del(key) {
    await this.connectedPromise; // Ensure connection is established
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          console.error('Error deleting key from Redis:', err);
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
