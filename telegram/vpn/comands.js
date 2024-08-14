

const { InputFile } = require("grammy");
const { getRandomPrediction, todayChecker } = require('../../middleware/prediction');
const { createNewClient, checkOnline, wgShow } = require('../../middleware/vpn');
const { checkUser, getUsers } = require('../../middleware/user');
const Option = require('../../models/options');


const start = async (ctx, menu) => {
  const user = await checkUser(ctx.message.from)
  todayChecker(user);
  ctx.reply(
`Привет ${user.name}.

<b>Инструкция по установке:</b>

1. Скачай приложение Wireguard
  Android:  <a href="https://play.google.com/store/apps/details?id=com.wireguard.android">Play market</a>
  iOS:  <a href="https://itunes.apple.com/us/app/wireguard/id1441195209?ls=1&mt=8">App store</a>
  Other:  <a href="https://www.wireguard.com/install/">Wireguard official</a>

2. Получи и скачай файл конфигурации

3. Добавь конфигурацию в приложении

4. Включай и наслаждайся 😉`,
    {
      parse_mode: "HTML",
      reply_markup: menu,
      link_preview_options: { is_disabled: true }
    }
  )
};

const get =  async (ctx) => getRandomPrediction(ctx);

const create = async (ctx) => {
  const from = ctx?.message?.from || ctx?.update?.callback_query?.from
  const option = await Option.findOne();
  if (option.canCreateNewConfig) {
    const user = await checkUser(from)
    const { path, key } = await createNewClient(user.name);
    user.history.push(key);
    user.save();
    ctx.replyWithDocument(new InputFile(path));
  }
  return from
};

const onlineCheck = async (ctx) => {
  const users = await getUsers();
  const array = await checkOnline();
  const result = array.reduce((acc, cur) => {
    const currentUser = users.find((user) => {
      return user.history.includes(cur.key);
    });
    const name = currentUser ? currentUser.name : cur.key;
    acc.push(`${name}\r\n${cur.date}`);
    return acc;
  }, []);
  if (result.length) ctx.reply(`${result.join('\r\n\r\n')}`);
};

const show = async (ctx) => {
  const data = await wgShow();
  ctx.reply(data);
}

module.exports = {
  get,
  show,
  start,
  create,
  onlineCheck,
};

// const sendToAll = async (ctx) => {
//   if (isAdmin(ctx.message.from.id)) {
//     const users = await UserTelegram.find();
//     users.forEach(async (user) => {
//       const { id, text, image_id } = await findRandomPrediction(user);
//       bot.api.sendPhoto(user.telegram_id, image_id, { caption: text })
//       user.history.push(id);
//       user.save();
//     });
//   }
// };
// const sendToOne = async (ctx) => {
//   const { id: ctxId } = ctx.update.message.from;
//   const { text } = ctx.update.message;
//   const telegramId = text.replace('/sendToOne ', '');
//   console.log(telegramId)
//   const { admin } = await UserTelegram.findOne({ telegram_id: ctxId });
//   if (admin) {
//     const user = await UserTelegram.findOne({ telegram_id: telegramId });
//     console.log(user)
//     const { id, text: message, image_id } = await findRandomPrediction(user);
//     if (image_id) {
//       user.history.push(id);
//       user.save();
//       bot.api.sendPhoto(telegramId, image_id, {
//           caption: message,
//         })
//     }
//   }
// }



// const create = async (ctx) => {
//   const { id } = ctx.message.from;
//   const { text } = ctx.message;
//   const prediction = text.replace('/create', '');
//   const { admin } = await UserTelegram.findOne({ telegram_id: id });
//   if (admin) {
//     if (prediction) {
//       console.log(ctx);
//       // await Prediction.create({ created_by: id, text: prediction })
//       ctx.reply(`=)))`)
//     } else ctx.reply(`)))=`)
//   } else ctx.reply(`Только для админа`)
// };

// const CreateImage = async (ctx) => {
//   const { id } = ctx.message.from;
//   const { image } = ctx.message;
//   // const prediction = text.replace('/create', '');
//   const { admin } = await UserTelegram.findOne({ telegram_id: id });
//   if (admin) {
// };