// const sendToAll = async (ctx) => {
//   if (isAdmin(ctx.message.from.id)) {
//     const users = await modelfind();
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
//   const { admin } = await modelfindOne({ telegram_id: ctxId });
//   if (admin) {
//     const user = await modelfindOne({ telegram_id: telegramId });
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
//   const { admin } = await modelfindOne({ telegram_id: id });
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
//   const { admin } = await modelfindOne({ telegram_id: id });
//   if (admin) {
// };
