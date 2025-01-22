const donate = require('../commands/donation');
const { DONATION_LIST } = require('../constants');

const values = DONATION_LIST.map((donation) => ({
  name: `donation-${donation}`,
  method: async (ctx) => {
    await donate(ctx, donation);
  },
 }))

module.exports = values;
