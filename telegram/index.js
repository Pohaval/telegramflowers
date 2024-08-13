const { Bot } = require("grammy");

const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const commands = require('./comands');
const menus = require('./menus');


bot.use(menus.getTunnel);

bot.command("start", (ctx) => commands.start(ctx, menu));
bot.command("get", commands.get);
bot.command("create", commands.create);


bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "create", description: "Create vpn tunnel" },
]);

module.exports = { bot };
