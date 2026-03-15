const { getInfo } = require('../../../middleware/onlineInfo');
const { formatDistance } = require('date-fns');
const ru = require('date-fns/locale/ru');

module.exports = async (ctx) => {
  const {
    count,
    totalTx,
    totalRx,
    users,
  } = await getInfo();

  const usersRes = users.map(({ user, key, latestHandshake, totalRx: userTotalRx, totalTx: userTotalTx, transferRx, transferTx }) => {
    const result = formatDistance(new Date(latestHandshake * 1000), new Date(), {
      addSuffix: true,
      locale: ru,
    });
    const rx = userTotalRx ?? transferRx ?? 0;
    const tx = userTotalTx ?? transferTx ?? 0;

    return `${user ? user.name : key}\r\n ${result}\r\n RX: ${(rx / (1024 * 1024)).toFixed(2)} MB \r\n TX: ${(tx / (1024 * 1024)).toFixed(2)} MB`;
  });

  ctx.reply(`Всего: ${count};\r\n RX: ${(totalRx / (1024 * 1024)).toFixed(2)} MB;\r\n TX: ${(totalTx / (1024 * 1024)).toFixed(2)} MB;  \r\n\r\n ${usersRes.join('\r\n\r\n')}`);
};
