

const { InputFile } = require("grammy");
const { getRandomPrediction, todayChecker } = require('../middleware/prediction');
const { createNewClient, checkOnline } = require('../middleware/vpn');
const { checkUser, getUsers } = require('../middleware/user');


const start = async (ctx, menu) => {
  const user = await checkUser(ctx.message.from)
  todayChecker(user);
  ctx.reply(
    `Привет ${user.name}.

<b>Инструкция по установке:</b>

1. Скачайте приложение Wireguard
  Android:  <a href="https://play.google.com/store/apps/details?id=com.wireguard.android">Play market</a>
  Other:  <a href="https://www.wireguard.com/install/">Wireguard official</a>

2. Получи файл конфигурации

3. Импортируй конфигурацию в приложении

4. Включай и наслаждайся 😉
`,
    {
      parse_mode: "HTML",
      reply_markup: menu,
      link_preview_options: { is_disabled: true }
    }
  )
};

const get =  async (ctx) => getRandomPrediction(ctx);

const create = async (ctx) => {
  const user = await checkUser(ctx.message.from)
  const { path, key } = await createNewClient(user.name);
  user.history.push(key);
  user.save();
  ctx.replyWithDocument(new InputFile(path));
};

const onlineCheck = async (ctx) => {
  const users = await getUsers();
  const array = await checkOnline();
  const result = array.reduce((acc, cur) => {
    const currentUser = users.find((user) => {
      user.history.includes(cur.key);
    });
    const name = currentUser ? currentUser.name : cur.key;
    acc.push(`${name}\r\n${cur.date}`);
    return acc;
  }, []);
  ctx.reply(`${result.join('\r\n')}`);
};

module.exports = {
  get,
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
