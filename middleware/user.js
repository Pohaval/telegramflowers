const UserTelegram = require('../models/userTelegram');

async function checkUser({ id: telegram_id, first_name: name }) {
  let user = await UserTelegram.findOne({ telegram_id })
  if (!myUser) user = await UserTelegram.create({ name, telegram_id, admin: false, lastDayGet: 0, todayCount: 3 });
  return user;
}

async function isAdmin(telegram_id) {
  const { admin } = await UserTelegram.findOne({ telegram_id});
  return admin;
}

module.export = {
  checkUser,
  isAdmin,
}
