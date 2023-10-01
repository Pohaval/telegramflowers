const { Bot } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
const { getRandomPrediction, setPhotoToPredicition, getPeredictionsNoPhoto } = require('../middleware/prediction');

const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const commands = require('./comands');
const menu = new Menu("my-menu-identifier").text("Получить!", getRandomPrediction);


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

// bot.on("message", (ctx) => ctx.reply("=)"));
bot.on(":photo", async (ctx) => {
  const file = await ctx.getFile();

  // await ctx.replyWithPhoto(file.file_id, {
  //   caption: 'test',
  //   reply_markup: menu,
  // });

  ctx.reply(`${file.file_id}`, { reply_markup: menuChoosePrediction })

  ctx.reply("=)")
});

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "get", description: "Get prediction" },
  // { command: "create", description: "Create prediction" },
]);

module.exports = { bot };
