const { Bot } = require("grammy");
const { Menu } = require("@grammyjs/menu");

const { getRandomPrediction } = require('../middleware/prediction');
const commands = require('./comands');

const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const menu = new Menu("my-menu-identifier").text("Получить!", getRandomPrediction);
bot.use(menu);

bot.command("start", (ctx) => commands.start(ctx, menu));
bot.command("get", commands.get);
bot.command("create", commands.create);

bot.on("message", (ctx) => ctx.reply("=)"));

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "get", description: "Get prediction" },
  { command: "create", description: "Create prediction" },
]);

module.exports = { bot };
