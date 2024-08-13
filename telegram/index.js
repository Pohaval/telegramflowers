const { Bot } = require("grammy");
const app = require('wireguard-rest');

app.listen(1234, function(){
    console.log(`Wireguard API listening on port 1234`);
});

const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");

const commands = require('./comands');
const menus = require('./menus');


bot.use(menus.getTunnel);

bot.command("start", (ctx) => commands.start(ctx, menus.getTunnel));
bot.command("get", commands.get);
bot.command("create", commands.create);
bot.command("checkOnline", commands.onlineCheck);


bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "create", description: "Create vpn tunnel" },
]);

module.exports = { bot };
