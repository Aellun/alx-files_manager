#!/usr/bin/node

const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { pwdHashed } = require('../utils');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    const dbUrl = `mongodb://${host}:${port}`;
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true });

    // Establishing the connection
    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
        this.db = this.client.db(this.database); // Store reference to the DB
        this.connected = true;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        this.connected = false;
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    if (!this.isAlive()) return 0; // Ensure connection
    try {
      const users = await this.db.collection('users').countDocuments();
      return users;
    } catch (error) {
      console.error('Error counting users:', error.message);
      return 0;
    }
  }

  async nbFiles() {
    if (!this.isAlive()) return 0; // Ensure connection
    try {
      const files = await this.db.collection('files').countDocuments();
      return files;
    } catch (error) {
      console.error('Error counting files:', error.message);
      return 0;
    }
  }

  async createUser(email, password) {
    if (!this.isAlive()) return null; // Ensure connection
    const hashedPwd = pwdHashed(password);
    try {
      const user = await this.db.collection('users').insertOne({ email, password: hashedPwd });
      return user;
    } catch (error) {
      console.error('Error creating user:', error.message);
      return null;
    }
  }

  async getUser(email) {
    if (!this.isAlive()) return null; // Ensure connection
    try {
      const user = await this.db.collection('users').findOne({ email });
      return user || null;
    } catch (error) {
      console.error('Error fetching user by email:', error.message);
      return null;
    }
  }

  async getUserById(id) {
    if (!this.isAlive()) return null; // Ensure connection
    try {
      const _id = new mongo.ObjectID(id);
      const user = await this.db.collection('users').findOne({ _id });
      return user || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      return null;
    }
  }

  async userExist(email) {
    const user = await this.getUser(email);
    return user !== null;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
