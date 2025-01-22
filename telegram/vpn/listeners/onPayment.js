const { checkUser } = require('../../../middleware/user');

module.exports = {
  name: 'pre_checkout_query',
  method: async (ctx) => {
    ctx.answerPreCheckoutQuery(true).catch(() => {
      console.error("answerPreCheckoutQuery failed");
    });
}};
