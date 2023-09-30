

const UserTelegram = require('../../models/userTelegram');
async function getRandomPrediction(ctx) {
  const { id: telegram_id, lastDayGet  } = ctx.update.callback_query.from;
  const user = await UserTelegram.findOne({ telegram_id });

  if (!isToday(new Date(user.lastDayGet))) {
    const text = await findRandomPredictionText();
    if (text) {
      user.lastDayGet = Date.now();
      user.save();
      ctx.reply(text);
    }
    else ctx.reply('Нет предсказаний')
  } else ctx.reply('На сегодня предсказаний больше нет')
};
module.exports = {
  start: async (ctx, menu) => {
    const { id: telegram_id, first_name: name } = ctx.message.from;
    const myUser = await UserTelegram.findOne({ telegram_id })
    if (!myUser) await UserTelegram.create({ name, telegram_id, admin: false, lastDayGet: 0 });
    ctx.reply(`Привет ${name}. Нажми чтобы получить предсказание`, { reply_markup: menu })
  },
  get: async (ctx) => getRandomPrediction(ctx),
  create: async (ctx) => {
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
  },
};
