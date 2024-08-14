const { Menu } = require("@grammyjs/menu");
const commands = require('./comands');

const getTunnel = new Menu("my-menu-identifier").text(
  "Получить конфигурацию",
  (ctx) => {
    console.log(ctx.api);
    commands.create(ctx);
  },
);

module.exports = {
  getTunnel
};
