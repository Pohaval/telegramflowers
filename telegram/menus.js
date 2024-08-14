const { Menu } = require("@grammyjs/menu");
const commands = require('./comands');
const admin = 361200498;

const getTunnel = new Menu("my-menu-identifier").text(
  "Получить конфигурацию",
  async (ctx) => {
    const dawait = await commands.create(ctx);
    // ctx.api.sendMessage(admin, dawait || 'no_user');
    ctx.api.sendMessage(admin, 'test' || 'no_user');
  },
);

module.exports = {
  getTunnel
};
