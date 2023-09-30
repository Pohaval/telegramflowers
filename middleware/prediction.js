const { isToday } = require('date-fns');
const UserTelegram = require('../models/userTelegram');

async function findRandomPredictionText() {
  const count = await Prediction.count({})
  var random = Math.floor(Math.random() * count)
  if (count) {
    const prediction = await Prediction.findOne().skip(random)
    return prediction.text;
  }
};

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
  getRandomPrediction,
};
