const crypto = require('crypto');

/**
 * Generates an uppercase booking reference formatted like: IMV-26A8-F92C
 */
const generateBookingReference = () => {
  const prefix = 'IMV';
  const randomPart1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const randomPart2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const timestampPart = Math.floor(Date.now() / 1000).toString().slice(-4);
  return `${prefix}-${randomPart1}${timestampPart}-${randomPart2}`;
};

module.exports = generateBookingReference;
