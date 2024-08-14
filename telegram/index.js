const commands = require('./comands');
const menus = require('./menus');
const Option = require('../models/options');
const path = require('path');
const fs = require('fs');

const { Bot } = require("grammy");
const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");
const admin = 361200498;

const start = async () => {
  const option = await Option.findOne();
  if (!option) await Option.create({ canCreateNewConfig: true });
  bot.api.sendMessage(admin, option?.canCreateNewConfig || 'false');
};
start();

// function script() {
//   const files = fs.readdirSync('/root').filter((name) => name.includes('.conf'));
//   files.forEach((name) => {
//     fs.readFile(`/root/${name}`, 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       if (data.includes('IW5N/Rut')) bot.api.sendMessage(admin, data);
//     });
//   })

// };
// script();
bot.use(menus.getTunnel);

bot.command("start", (ctx) => commands.start(ctx, menus.getTunnel));
bot.command("get", commands.get);
bot.command("create", async (ctx) => {
  const dawait = await commands.create(ctx);
  bot.api.sendMessage(admin, dawait || 'no_user');
});
bot.command("checkOnline", commands.onlineCheck);
bot.command("show", commands.show);
bot.command("off", async (ctx) => {
  if (ctx.message.from.id === admin) {
    const option = await Option.findOne();
    option.canCreateNewConfig = false;
    option.save();
    ctx.reply("ok!");
   }
});
bot.command("on", async (ctx) => {
  if (ctx.message.from.id === admin) {
    const option = await Option.findOne();
    option.canCreateNewConfig = true;
    option.save();
    ctx.reply("ok!");
   }
});


bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "create", description: "Create vpn tunnel" },
]);

module.exports = { bot };

// const app = require('wireguard-rest');
// app.listen(1234, function(){
//     console.log(`Wireguard API listening on port 1234`);
// });
