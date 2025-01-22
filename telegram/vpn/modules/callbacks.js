
const path = require('path');
const fs = require('fs');

module.exports = (bot, dirName) => {
  const mPath = `${dirName}/callbacks`
  const listenersList = fs.readdirSync(mPath);

  listenersList.forEach(cPath => {
    const methods = require(path.resolve(mPath, cPath));
    methods.forEach(({ name, method }) => {
      console.log(name);
      bot.callbackQuery(name, method);
    })
  });
}

