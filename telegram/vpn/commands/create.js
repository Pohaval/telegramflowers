
const { InputFile } = require("grammy");
const { createNewClient } = require('../../../middleware/vpn');
const { checkUser } = require('../../../middleware/user');
const Option = require('../../../models/options');

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

module.exports = create;
