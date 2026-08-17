const crypto = require('crypto');

module.exports = function generateTrackingCode() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `RD${timePart}${randPart}`;
};
