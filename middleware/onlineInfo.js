const { UserTelegram } = require('../models/userTelegram');
const onlineInfo = require('../models/onlineInfo');
const vpn = require('./vpn');

let interval;

function setIntervalGetInfo() {
  const minutes = 5;
  const the_interval = minutes * 60 * 1000;
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    getInfo({ persist: true, saveHistory: true }).catch((error) => {
      console.error('Failed to update online info', error);
    });
  }, the_interval);
};

function getTotalTransfer(transfer, lastTransfer, lastTotal) {
 const difference = transfer >= lastTransfer ? transfer - lastTransfer : transfer;
 return lastTotal + difference;
}

async function getInfo({ persist = false, saveHistory = false } = {}) {
  const currentDate = new Date();
  const data = await vpn.wgShow();

  const lastInfo = await onlineInfo.findOne().sort({ date: -1 });
  const lastTotalRx = lastInfo?.totalRx || 0;
  const lastTotalTx = lastInfo?.totalTx || 0;
  const lastTransferRx = lastInfo?.transferRx || 0;
  const lastTransferTx = lastInfo?.transferTx || 0;

  const promises = data.map(async (i) => {
    const user = await UserTelegram.findOne({ history: { "$in" : [i.key]} });
    return {
      ...i,
      user: user ? user : {},
    }
  });

  const peers = await Promise.all(promises);
  const usersToSave = [];

  const resData = peers.reduce((acc, { key, peer, user }) => {
    const lastUserTx = user?.transferTx || 0;
    const lastUserRx = user?.transferRx || 0;
    const lastUserTotalTx = user?.totalTx || 0;
    const lastUserTotalRx = user?.totalRx || 0;
    const userTotalTx = getTotalTransfer(peer.transferTx || 0, lastUserTx, lastUserTotalTx);
    const userTotalRx = getTotalTransfer(peer.transferRx || 0, lastUserRx, lastUserTotalRx);

    if (user?._id) {
      user.totalTx = userTotalTx;
      user.totalRx = userTotalRx;
      user.transferTx = peer.transferTx || 0;
      user.transferRx = peer.transferRx || 0;
      user.lastDayGet = peer.latestHandshake;

      if (persist) {
        usersToSave.push(user.save());
      }
    }

    return {
      transferTx: acc.transferTx + (peer.transferTx || 0),
      transferRx: acc.transferRx + (peer.transferRx || 0),
      users: [
        ...acc.users,
        {
          ...(user?._id ? {
            user: {
              id: user.id,
              name: user.name,
            },
          } : {}),
          transferTx: peer.transferTx || 0,
          transferRx: peer.transferRx || 0,
          totalTx: userTotalTx,
          totalRx: userTotalRx,
          latestHandshake: peer.latestHandshake,
          key,
        },
      ],
    };
  }, { transferTx: 0, transferRx: 0, users: [] });


  const totalTX = getTotalTransfer(resData.transferTx, lastTransferTx, lastTotalTx);
  const totalRX = getTotalTransfer(resData.transferRx, lastTransferRx, lastTotalRx);

  const res = {
    date: currentDate,
    count: data.length,
    transferTx: resData.transferTx,
    transferRx: resData.transferRx,
    totalTx: totalTX,
    totalRx: totalRX,
    users: resData.users,
  };

  if (persist) {
    await Promise.all(usersToSave);
  }

  if (saveHistory) {
    await onlineInfo.create(res);
  }

  return res;
};

module.exports = {
  setIntervalGetInfo,
  getInfo
};
