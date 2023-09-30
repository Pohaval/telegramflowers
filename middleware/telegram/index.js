const { isToday } = require('date-fns');

const UserTelegram = require('../../models/userTelegram');
const Prediction = require('../../models/prediction');

const { Bot } = require("grammy");
const { Menu } = require("@grammyjs/menu");
const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const menu = new Menu("my-menu-identifier")
  .text("Получить!", getRandomPrediction);
bot.use(menu);

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
]);

async function findRandomPredictionText() {
  const count = await Prediction.count({})
  if (count === 0) return null
  var random = Math.floor(Math.random() * count)
  console.log('random', random);

  const prediction = await Prediction.findOne().skip(random)
  return prediction.text;
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


bot.command("start", async (ctx) => {
  const { id: telegram_id, first_name: name } = ctx.message.from;
  const myUser = await UserTelegram.findOne({ telegram_id })
  bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "get", description: "Get prediction" },
    ...myUser.admin ? [{ command: "create", description: "Create prediction" }] : [],
  ]);
  if (!myUser) await UserTelegram.create({ name, telegram_id, admin: false, lastDayGet: 0 });
  ctx.reply(`Привет ${name}. Нажми чтобы получить предсказание`, { reply_markup: menu })
});

bot.command("get", async (ctx) => getRandomPrediction(ctx));

bot.command("create", async (ctx) => {
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
}).on("message", (ctx) => ctx.reply("=)))))"));

bot.on("message", (ctx) => ctx.reply("=)"));

module.exports = { bot };
