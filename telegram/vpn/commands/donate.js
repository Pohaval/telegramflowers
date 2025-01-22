
const { InlineKeyboard } = require('grammy');

const { DONATION_LIST } = require('../constants');



const inlineKeyboard = DONATION_LIST.reduce((acc, donation) => {
  if (!acc) acc = new InlineKeyboard()
  return acc.text(donation, `donation-${donation}`);
}, null);


module.exports = async (ctx) => {
  await ctx.reply('Выберите количество звезд для пожертвования', {
    reply_markup: inlineKeyboard,
  });
};
