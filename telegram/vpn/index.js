const commands = require('./comands');
const menus = require('./menus');
const Option = require('../../models/options');
const path = require('path');
const fs = require('fs');
require("dotenv").config();
const { UserTelegram } = require('../../models/userTelegram');
const onlineInfo = require('../../models/onlineInfo');

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

const { Bot } = require("grammy");
const bot = new Bot("6245127615:AAE2IB_uUiU1kkkSzNJOn7D8PnBwBiPnL8Y");
const admin = 361200498;

const start = async () => {
  const option = await Option.findOne();
  if (!option) await Option.create({ canCreateNewConfig: true });
  bot.api.sendMessage(admin, option?.canCreateNewConfig || 'false');
};
start();

const minutes = 10;
const the_interval = minutes * 60 * 1000;
// setInterval(getInfo, the_interval);

async function getInfo() {
  const currentDate = new Date();
  const data = await commands.wgShow();
  const filtered = data.filter(({ peer }) => {
    const aFiveMinuteAgo = new Date(Date.now() - 1000 * 60 * 5);
    return isWithinInterval(new Date(peer.latestHandshake), {
      start: aFiveMinuteAgo,
      end: currentDate,
    })
  });
  let users = [];
  onlineInfo.find()
  let transferRx = 0;
  let transferTx = 0
  if (filtered.length) {
    users = await UserTelegram.find();
  }
  const res = {
    date: currentDate,
    count: filtered.length,
    transferRx,
    transferTx,
    users: users.reduce((acc, user) => {
      if (filtered.some(({ peer }) => user.history.includes(peer.publicKey))) {
        acc.push(user);
        user.lastDayGet = peer.latestHandshake;
        user.save();
      }
      return acc;
    }, []),
  };
  onlineInfo.create(res);
};

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

bot.on("message:text", async (ctx) => {
  // Text is always present because this handler is called when a text message is received.
  try {
    const prompt = ctx.msg.text;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: "Write a haiku about recursion in programming.",
          },
      ],
  });
    ctx.reply(completion.choices[0].message);
  } catch (error) {
    ctx.reply(error)
  };
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
