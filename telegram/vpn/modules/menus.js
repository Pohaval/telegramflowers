
const path = require('path');
const fs = require('fs');

module.exports = (bot, dirName) => {
  const menusPath = `${dirName}/menus`
  const menusList = fs.readdirSync(menusPath);

  menusList.forEach(menuPath => {
    const menu = require(path.resolve(menusPath, menuPath));
    bot.use(menu);
  });
}

