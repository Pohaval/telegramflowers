const { isToday } = require('date-fns');

const { isToday, format } = require('date-fns');
const UserTelegram = require('../models/userTelegram');
const Prediction = require('../models/prediction');

function todayChecker(user) {
  if (user && !isToday(new Date(user.lastDayGet))) {
    myUser.todayCount = 3;
    myUser.save();
  }
};

async function findRandomPrediction(user) {
  const predictions = await Prediction.find();
  const filtredPrediction = predictions.filter((i) => !user.history.includes(i.id))
  var random = Math.floor(Math.random() * filtredPrediction.length)

  return filtredPrediction[random] || {};
};


async function getRandomPrediction(ctx) {
  const { id: telegram_id, lastDayGet  } = ctx.update?.callback_query?.from || ctx.update?.message?.from;
  const user = await UserTelegram.findOne({ telegram_id });

  const HOURS_TO_VIEW = 0.01;
  const SERVER_HOURS = -3;

  const hoursToMilliseconds = (hour) => hour * 60 * 60 * 1000;
  const DateTimePlus = hoursToMilliseconds(HOURS_TO_VIEW) + user.lastDayGet;
  const Now = Date.now();
  if (DateTimePlus > Now) {
    const nowToServer = new Date(Now - hoursToMilliseconds(SERVER_HOURS));
    const time = format(new Date(DateTimePlus - nowToServer), 'HH:mm:ss');
    ctx.reply(`Получать предсказания можно раз в пол часа. Осталось ${time}`);
    return;
  }
  if (!isToday(new Date(user.lastDayGet)) || user.todayCount !== 0) {
    const { id, text, image_id} = await findRandomPrediction(user);
    if (!id) {
      ctx.reply('Закончились(')
      return
    }
    // 315606425
    user.lastDayGet = Now;
    user.history.push(id);
    user.todayCount -= 1;
    user.save();

    if (image_id) {
      await ctx.replyWithPhoto(image_id, {
        caption: text,
      });
    } else ctx.reply(text);

  } else ctx.reply('На сегодня предсказаний больше нет')
};

async function setPhotoToPredicition(ctx, prediction_id) {
    const { text } = ctx.update.callback_query.message;
    console.log(prediction_id);
    console.log(text);
    const prediction = await Prediction.findById(prediction_id)
    console.log(prediction);
    prediction.image_id = text;
    prediction.save();
    ctx.deleteMessage();
};

async function getPeredictionsNoPhoto(page = 0) {
  return await Prediction.find({image_id: null}).limit(5).skip(5 * page);
};

module.exports = {
  todayChecker,
  getRandomPrediction,
  setPhotoToPredicition,
  findRandomPrediction,
  getPeredictionsNoPhoto,
};
