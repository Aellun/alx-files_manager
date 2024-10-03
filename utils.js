// utils.js

const crypto = require('crypto');

function pwdHashed(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = { pwdHashed };
