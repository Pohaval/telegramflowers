const { checkUser } = require('../../../middleware/user');
const Option = require('../../../models/options');
const getTunnel = require('../menus/getTunnel');
const admin = process.env.ADMIN_ID;

// const { todayChecker } = require('../../middleware/prediction');

const MESSAGE = (user) => `
⭐ Привет ${user.name}. ⭐

<b>Инструкция по установке:</b>

1. Скачай приложение
      Android:  <a href="https://play.google.com/store/apps/details?id=com.wireguard.android">Play market</a>
      iOS:  <a href="https://itunes.apple.com/us/app/wireguard/id1441195209?ls=1&mt=8">App store</a>
      Other:  <a href="https://www.wireguard.com/install/">official</a>

2. Получи и скачай файл конфигурации

3. Добавь конфигурацию в приложении

4. Включай и наслаждайся 😉
`

const options = {
  parse_mode: "HTML",
  reply_markup: getTunnel,
  link_preview_options: { is_disabled: true }
};

module.exports = async (ctx) => {
  const user = await checkUser(ctx?.update?.message?.from || ctx?.message?.from);
  ctx.api.sendMessage(admin, user || 'no_user');
  const option = await Option.findOne();
  if (option.canCreateNewConfig) {
    ctx.reply(MESSAGE(user), options)
  }
};
