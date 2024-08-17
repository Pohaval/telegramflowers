
async function on(ctx) {
  if (ctx.message.from.id === admin) {
    const option = await Option.findOne();
    option.canCreateNewConfig = true;
    option.save();
    ctx.reply("ok!");
   }
};
async function off(ctx) {
  if (ctx.message.from.id === admin) {
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
