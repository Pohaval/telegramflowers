const { Bot, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const {
  getRandomPrediction,
  setPhotoToPredicition,
  getPeredictionsNoPhoto,
  findRandomPrediction,
} = require('../middleware/prediction');

const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const commands = require('./comands');
const menu = new Menu("my-menu-identifier").text("Получить!", getRandomPrediction);
const Prediction = require('../models/prediction');
const UserTelegram = require('../models/userTelegram');
const keyboard = new InlineKeyboard().game("Start my_game");

const menuChoosePrediction = new Menu("dynamic");
menuChoosePrediction
  .dynamic(async () => {
    // Generate a part of the menu dynamically!
    const range = new MenuRange();
    const predictions = await getPeredictionsNoPhoto();
    for (let i = 0; i < predictions.length; i++) {
    const text = predictions[i].text.substr(0, 42);
    range
        .text(text, (ctx) => setPhotoToPredicition(ctx, predictions[i].id)).row();
    }
    return range;
  })
  .text("Cancel", (ctx) => ctx.deleteMessage()).text("next page", (ctx) => {});
// const menuChoosePrediction = new Menu("my-menu-identifier").text("test", setPhotoToPredicition);

bot.use(menuChoosePrediction);
bot.use(menu);

bot.command("start", (ctx) => commands.start(ctx, menu));
bot.command("get", commands.get);
bot.command("create", commands.create);

bot.command("sendTo", async (ctx) => {
  const { id: ctxId } = ctx.message.from;
  const { admin } = await UserTelegram.findOne({ telegram_id: ctxId });
  if (admin) {
    const users = await UserTelegram.find();
    console.log(users);
    users.forEach(async (user) => {
      const { id, text, image_id } = await findRandomPrediction(user);
      bot.api.sendPhoto(user.telegram_id, image_id, {
        caption: text,
      })
      user.history.push(id);
      user.save();
    });
  }
});
bot.command("sendToOne", async (ctx) => {
  const { id: ctxId } = ctx.update.message.from;
  const { text } = ctx.update.message;
  const telegramId = text.replace('/sendToOne ', '');
  console.log(telegramId)
  const { admin } = await UserTelegram.findOne({ telegram_id: ctxId });
  if (admin) {
    const user = await UserTelegram.findOne({ telegram_id: telegramId });
    console.log(user)
    const { id, text: message, image_id } = await findRandomPrediction(user);
    if (image_id) {
      user.history.push(id);
      user.save();
      bot.api.sendPhoto(telegramId, image_id, {
          caption: message,
        })
    }
  }
});

bot.command("getGame", (ctx) => {
  ctx.replyWithGame('test', { reply_markup: keyboard });

});
bot.on("callback_query:game_short_name", async (ctx) => {
  await ctx.answerCallbackQuery({ url: "https://jmendeth.com" });
});


bot.on(":photo", async (ctx) => {
  const { id } = ctx.message.from;
  const { admin } = await UserTelegram.findOne({ telegram_id: id });
  if (admin) {
    const { file_id } = await ctx.getFile();
    const text = ctx.update.message.caption;
    const prediction = await Prediction.create({ created_by: id, text, image_id: file_id })
    ctx.reply(`${prediction.id}`)
  }
});

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "get", description: "Get prediction" },
  // { command: "create", description: "Create prediction" },
]);

module.exports = { bot };
