const { Bot } = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const initMenus = require('./modules/menus');
const initCommands = require('./modules/commands');
const initListeners = require('./modules/listeners');
const initCallbacks = require('./modules/callbacks');

const bot = new Bot(process.env.BOT_ID);

bot.use(hydrate());

initMenus(bot, __dirname);
initCommands(bot, __dirname);
initListeners(bot, __dirname);
initCallbacks(bot, __dirname);

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "create", description: "Create vpn tunnel" },
  { command: "donate", description: "Donation" },
]);

// bot.catch((err) => {
//   const ctx = err.ctx;
//   console.error(`Error while handling update ${ctx.update.update_id}:`);
//   console.log(err);
//   const e = err.error;
//   if (e instanceof GrammyError) {
//     console.error("Error in request:", e.description);
//   } else if (e instanceof HttpError) {
//     console.error("Could not contact Telegram:", e);
//   } else {
//     console.error("Unknown error:", e);
//   }
// });

module.exports = { bot };

