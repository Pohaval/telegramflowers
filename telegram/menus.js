const { Menu } = require("@grammyjs/menu");
const commands = require('./comands');

const getTunnel = new Menu("my-menu-identifier").text(
  "Получить конфигурацию",
  commands.create,
);

module.exports = {
  getTunnel
};
