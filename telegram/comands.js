

const { isToday } = require('date-fns');
const UserTelegram = require('../models/userTelegram');
const { getRandomPrediction } = require('../middleware/prediction');

const start = async (ctx, menu) => {
  const { id: telegram_id, first_name: name } = ctx.message.from;
  const myUser = await UserTelegram.findOne({ telegram_id })
  if (!myUser) await UserTelegram.create({ name, telegram_id, admin: false, lastDayGet: 0, todayCount: 3 });
  else if (!isToday(new Date(myUser.lastDayGet))) {
    myUser.todayCount = 3;
    myUser.save();
  }
  ctx.reply(`Привет ${name}. Нажми чтобы получить предсказание`, { reply_markup: menu })
};
const get =  async (ctx) => getRandomPrediction(ctx);
const create = async (ctx) => {
  const { id } = ctx.message.from;
  const { text } = ctx.message;
  const prediction = text.replace('/create', '');
  const { admin } = await UserTelegram.findOne({ telegram_id: id });
  if (admin) {
    if (prediction) {
      await Prediction.create({ created_by: id, text: prediction })
      ctx.reply(`=)))`)
    } else ctx.reply(`)))=`)
  } else ctx.reply(`Только для админа`)
};

// const CreateImage = async (ctx) => {
//   const { id } = ctx.message.from;
//   const { image } = ctx.message;
//   // const prediction = text.replace('/create', '');
//   const { admin } = await UserTelegram.findOne({ telegram_id: id });
//   if (admin) {
// };

module.exports = {
  start,
  get,
  create,
};
