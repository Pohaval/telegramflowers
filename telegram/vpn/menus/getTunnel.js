require("dotenv").config();
const { Menu } = require("@grammyjs/menu");
const create = require('../commands/create');
const donate = require('../commands/donate');
const admin = process.env.ADMIN_ID;

const getTunnel = new Menu("my-menu-identifier").text(
  "📃 Получить конфигурацию",
  async (ctx) => {
    const user = await create(ctx);
    ctx.api.sendMessage(admin, user || 'no_user');
  },
).row().text(
  "💗 Пожертвования",
  (ctx) => donate(ctx),
);

module.exports = getTunnel;
