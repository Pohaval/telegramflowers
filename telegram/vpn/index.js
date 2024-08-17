require("dotenv").config();
const { Bot } = require("grammy");
const commands = require('./comands');
const menus = require('./menus');
const admin = process.env.ADMIN_ID;
const { UserTelegram } = require('../../models/userTelegram');

const bot = new Bot(process.env.BOT_ID);

async function func() {
  const users = await UserTelegram.find(['+gRXbPrlRz7WfdEbjT5PAynd+xtxUdj9f8MNfg0kklw='])
  bot.api.sendMessage(admin, users);
};
func();

bot.use(menus.getTunnel);
bot.command("start", (ctx) => commands.start(ctx, menus.getTunnel));
bot.command("get", commands.get);
bot.command("create", async (ctx) => {
  const data = await commands.create(ctx);
  bot.api.sendMessage(admin, data || 'no_user');
});
bot.command("checkOnline", commands.onlineCheck);
bot.command("show", commands.show);
bot.command("off", commands.off);
bot.command("on", commands.on);


bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "create", description: "Create vpn tunnel" },
]);

module.exports = { bot };

// const app = require('wireguard-rest');
// app.listen(1234, function(){
//     console.log(`Wireguard API listening on port 1234`);
// });
