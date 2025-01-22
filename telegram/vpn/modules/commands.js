
const path = require('path');
const fs = require('fs');

module.exports = (bot, dirName) => {
  const commandsPath = `${dirName}/commands`
  const commandsList = fs.readdirSync(commandsPath);

  commandsList.forEach(commandPath => {
    const command = require(path.resolve(commandsPath, commandPath));
    const commandName = commandPath.replace('.js', '');
    bot.command(commandName, command);
  });
}

