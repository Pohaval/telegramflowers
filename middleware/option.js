
async function on(ctx) {
  if (Number(ctx.message.from.id) === Number(admin)) {
    const option = await Option.findOne();
    option.canCreateNewConfig = true;
    option.save();
    ctx.reply("ok!");
   }
};
async function off(ctx) {
  if (Number(ctx.message.from.id) === Number(admin)) {
    const option = await Option.findOne();
    option.canCreateNewConfig = false;
    option.save();
    ctx.reply("ok!");
   }
};

module.exports = {
  on,
  off,
};
