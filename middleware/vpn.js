const path = require('path');
const fs = require('fs');
const { WgConfig, getConfigObjectFromFile  } = require('wireguard-tools');



// const promises = files.map(async (name) => {
//   const filePath = path.join(__dirname, name)
//   const thatConfigFromFile = await getConfigObjectFromFile({ filePath });
//   return thatConfigFromFile;
// })

async function createNewClient(bot, ctx) {
  const files = fs.readdirSync('/root').filter((name) => name.includes('.conf'));
  const length = files.length;
  const id = length + 10;
  const filePath = path.join('/root', `/newWg-${id}.conf`);
  const serverFilePath = path.join('/etc/wireguard', `/wg0.conf`);
  const serverConf = await getConfigObjectFromFile({ filePath: serverFilePath });
  const server = new WgConfig({
    ...serverConf,
    filePath: serverFilePath,
  })
  const params = {
    wgInterface: {
      name: `Client ${id}`,
      address: [`10.66.66.${id}/32`,`fd42:42:42::${id}/128`],
      dns: ['1.1.1.1', '1.0.0.1'],
    },
    filePath,
  };
  const client = new WgConfig(params);
  await Promise.all([
    server.generateKeys({ preSharedKey: true }),
    client.generateKeys({ preSharedKey: true })
  ]);

  client.addPeer({
    allowedIps: ['0.0.0.0/0','::/0'],
    endpoint: ['45.132.1.20:59372'],
    publicKey: '7yIFNwTyAZT8jzJ80cmvv1El8/B3xemXciI65gjN9F4=',
    preSharedKey: client.preSharedKey
  });
  server.addPeer(client.createPeer({
    allowedIps: [`10.66.66.${id}/32`,`fd42:42:42::${id}/128`],
    preSharedKey: client.preSharedKey
  }))
  await client.writeToFile();
  await client.restart();
  await server.writeToFile();
  await server.restart();
  await client.down();
  console.log(ctx);
  bot.sendDocument(ctx.chat.id, `/root/newWg-${id}.conf`)
};

module.exports = {
  createNewClient,
};
