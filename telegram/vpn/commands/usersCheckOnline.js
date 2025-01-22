const { checkOnline } = require('../../../middleware/vpn');
const { getUsers } = require('../../../middleware/user');

const usersCheckOnline = async (ctx) => {
  const users = await getUsers();
  const array = await checkOnline();
  const result = array.reduce((acc, cur) => {
    const currentUser = users.find((user) => {
      return user.history.includes(cur.key);
    });
    const name = currentUser ? currentUser.name : cur.key;
    acc.push(`${name}\r\n${cur.date}`);
    return acc;
  }, []);
  if (result.length) ctx.reply(`${result.join('\r\n\r\n')}`);
};

module.exports = usersCheckOnline;
