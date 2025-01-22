const { checkUser } = require('../../../middleware/user');

module.exports = {
  name: 'message:successful_payment',
  method: async (ctx) => {

  if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
    console.log(error);
    return;
  }
  const user = await checkUser(ctx?.update?.message?.from || ctx?.message?.from);
  user.history.push(ctx.message.successful_payment);
  user.save();

  ctx.reply('🥳 Спасибо за пожертвования! 🫶');
  console.log(ctx.message.successful_payment);
}};


