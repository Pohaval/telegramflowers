
const { getInfo } = require('../../../middleware/onlineInfo');
const { formatDistance } = require('date-fns');
const ru =  require('date-fns/locale/ru');

module.exports = async (ctx) => {
  const {
    date,
    count,
    transferTx,
    transferRx,
    totalTX,
    totalRX,
    users
  } = await getInfo();

  const usersRes = users.map(({ user, key, latestHandshake, transferRx, transferTx }) => {
    const result = formatDistance(new Date(latestHandshake * 1000), new Date(), {
      addSuffix: true,
      locale: ru,
    })
    return `${user ? user.name : key}\r\n ${result}\r\n RX: ${(transferRx / (1024 * 1024)).toFixed(2)} МБ \r\n TX: ${(transferTx / (1024 * 1024)).toFixed(2)} МБ`
  });
  ctx.reply(`Всего: ${count};\r\n RX: ${(totalRX / (1024 * 1024)).toFixed(2)} МБ;\r\n TX: ${(totalTX / (1024 * 1024)).toFixed(2)} МБ;  \r\n\r\n ${usersRes.join('\r\n\r\n')}`);
};
