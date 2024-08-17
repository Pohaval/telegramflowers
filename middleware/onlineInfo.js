const { UserTelegram } = require('../models/userTelegram');
const onlineInfo = require('../models/onlineInfo');
const vpn = require('./vpn');
const { isWithinInterval } = require('date-fns');


function setIntervalGetInfo() {
  const minutes = 10;
  const the_interval = minutes * 60 * 1000;
  setInterval(getInfo, the_interval);
};

function getTotalTransfer(transfer, lastTransfer, lastTotal) {
 const difference = transfer >= lastTransfer ? transfer - lastTransfer : transfer;
 return lastTotal + difference;
}

async function getInfo() {
  const currentDate = new Date();
  const data = await vpn.wgShow();
  const filtered = data.filter(({ peer }) => {
    const aFiveMinuteAgo = new Date(Date.now() - 1000 * 60 * 5);
    return isWithinInterval(new Date(peer.latestHandshake * 1000), {
      start: aFiveMinuteAgo,
      end: currentDate,
    })
  });
  const lastInfo = await onlineInfo.findOne({}, {}, { sort: { 'created_at' : -1 } })
  const lastTotalRx = lastInfo?.totalRx || 0;
  const lastTotalTx = lastInfo?.totalTx || 0;
  const lastTransferRx = lastInfo?.transferRx || 0;
  const lastTransferTx = lastInfo?.transferTx || 0;

  const promises = filtered.map(async (i) => {
    const user = await UserTelegram.findOne({ history: { "$in" : [i.key]} });
    return {
      ...i,
      user: user ? user : {},
    }
  });

  const peers = await Promise.all(promises);
  console.log(peers);


  const resData = peers.reduce(async (acc, { key, peer, user }) => {
    const lastUserTx = user ? user?.transferTx : 0;
    const lastUserRx = user ? user?.transferRx : 0;
    const lastUserTotalTx = user ? user?.totalTx : 0;
    const lastUserTotalRx = user ? user?.totalRx : 0;
    user.totalTx = getTotalTransfer(peer.transferTx || 0, lastUserTx, lastUserTotalTx)
    user.totalRx = getTotalTransfer(peer.transferRx || 0, lastUserRx || lastUserTotalRx)
    user.transferTx = peer.transferTx;
    user.transferRx = peer.transferRx;
    user.lastDayGet = peer.latestHandshake;
    // user.save;
    return {
      transferTx: acc.tx + peer.transferTx,
      transferRx: acc.rx + peer.transferRx,
      users: [
        ...acc.users,
        {
          ...user.id ? {
            user: {
              id: user.id,
              name: user.name,
            },
          } : {},
          transferTx: peer.transferTx,
          transferRx: peer.transferRx,
          key,
        },
      ],
    };
  }, { transferTx: 0, transferRx: 0, users: [] });


  const totalTX = getTotalTransfer(resData.transferTx, lastTransferTx, lastTotalTx);
  const totalRX = getTotalTransfer(resData.transferRx, lastTransferRx, lastTotalRx);

  const res = {
    date: currentDate,
    count: filtered.length,
    transferTx: resData.transferTx,
    transferRx: resData.transferRx,
    transferRx,
    totalTX,
    totalRX,
    users: resData.users,
  };
  return res;
  // onlineInfo.create(res);
};

module.exports = {
  setIntervalGetInfo,
  getInfo
};
