const { Menu } = require("@grammyjs/menu");
const commands = require('./comands');
const { bot } = require("./telegram");
const admin = 361200498;

const getTunnel = new Menu("my-menu-identifier").text(
  "Получить конфигурацию",
  async (ctx) => {
    const dawait = await commands.create(ctx);
    bot.api.sendMessage(admin, dawait || 'no_user');
  },
);

module.exports = {
  getTunnel
};
