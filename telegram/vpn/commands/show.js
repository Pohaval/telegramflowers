const { wgShow } = require('../../../middleware/vpn');

module.exports = async (ctx) => {
  const data = await wgShow();
  ctx.reply(data);
};
