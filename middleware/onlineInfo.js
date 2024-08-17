const { UserTelegram } = require('../models/userTelegram');
const onlineInfo = require('../models/onlineInfo');


function setIntervalGetInfo() {
  const minutes = 10;
  const the_interval = minutes * 60 * 1000;
  setInterval(getInfo, the_interval);
};
async function getInfo() {
  const currentDate = new Date();
  const data = await commands.wgShow();
  const filtered = data.filter(({ peer }) => {
    const aFiveMinuteAgo = new Date(Date.now() - 1000 * 60 * 5);
    return isWithinInterval(new Date(peer.latestHandshake), {
      start: aFiveMinuteAgo,
      end: currentDate,
    })
  });
  let users = [];
  const lastInfo = await onlineInfo.findOne({}, {}, { sort: { 'created_at' : -1 } })
  const lastTotalRx = lastInfo?.totalRx || 0;
  const lastTotalTx = lastInfo?.totalTx || 0;
  const lastTransferRx = lastInfo?.transferRx || 0;
  const lastTransferTx = lastInfo?.transferTx || 0;

  const { transferTx, transferRx } = filtered.reduce((acc, cur) => ({
    tx: acc.tx + cur.transferTx,
    rx: acc.rx + cur.transferRx,
 }), { transferTx: 0, transferRx: 0 });

 const differenceTX = curTX > lastTransferTx ? curTx - lastTransferTx : curTX;
 const differenceRX = curRX > lastTransferRx ? curRx - lastTransferRx : curRX;

 const totalTX = lastTotalTx + differenceTX;
 const totalRX = lastTotalRx + differenceRX;

  if (filtered.length) {
    users = await UserTelegram.find();
  }

  const res = {
    date: currentDate,
    count: filtered.length,
    transferTx,
    transferRx,
    totalTX,
    totalRX,
    users: users.reduce((acc, user) => {
      if (filtered.some(({ peer }) => user.history.includes(peer.publicKey))) {
        acc.push(user);
        user.lastDayGet = peer.latestHandshake;
        user.save();
      }
      return acc;
    }, []),
  };
  onlineInfo.create(res);
};

module.exports = {
  setIntervalGetInfo,
  getInfo
};
