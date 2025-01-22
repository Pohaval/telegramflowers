
const path = require('path');
const fs = require('fs');

module.exports = (bot, dirName) => {
  const listenersPath = `${dirName}/listeners`
  const listenersList = fs.readdirSync(listenersPath);

  listenersList.forEach(listenerPath => {
    const listener = require(path.resolve(listenersPath, listenerPath));
    bot.on(listener.name, listener.method);
  });
}

