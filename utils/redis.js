#!/usr/bin/node

const { createClient } = require('redis');

class RedisClient {
  constructor() {
    this.client = createClient();

    // Handle connection events
    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
    });

    this.client.on('connect', () => {
      // console.log('Connected to Redis');
    });

    this.client.connect().then(() => {
      // console.log('Connection to Redis successful!');
    }).catch((err) => {
      console.log('Redis connection failed:', err);
    });
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    try {
      const val = await this.client.get(key);
      return val;
    } catch (error) {
      console.error('Error fetching from Redis:', error);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.set(key, value, {
        EX: duration, // Set expiry time
      });
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
