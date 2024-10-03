#!/usr/bin/node
const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Checks if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Checks if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Checks if user with this email already exists
    const userExists = await dbClient.getUser(email);
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Inserts the new user into the database
    const user = await dbClient.createUser(email, hashedPassword);

    // Returns the new user with only the email and id
    return res.status(201).json({ id: user.insertedId, email });
  }
}

module.exports = UsersController;
