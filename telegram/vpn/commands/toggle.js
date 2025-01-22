require("dotenv").config();

const Option = require("../../../models/options");
const admin = process.env.ADMIN_ID;

module.exports = async (ctx) => {
  if (Number(ctx.message.from.id) === Number(admin)) {
    let option = await Option.findOne();
    if (!option) option = Option.create({ canCreateNewConfig: false })
    option.canCreateNewConfig = !option.canCreateNewConfig;
    option.save();
    ctx.reply(`${option.canCreateNewConfig ? 'on' : 'off'}`);
  }
};
