const path = require('path');
const fs = require('fs');
const { Wg } = require('wireguard-wrapper');
const { WgConfig, getConfigObjectFromFile  } = require('wireguard-tools');
const { format } = require('date-fns');

const serverFilePath = path.join('/etc/wireguard', `/wg0.conf`);
const filePath = (id) => path.join('/root', `/newWg-${id}.conf`);

const clientPeer = {
  allowedIps: ['0.0.0.0/0','::/0'],
  endpoint: ['45.132.1.20:59372'],
  publicKey: '7yIFNwTyAZT8jzJ80cmvv1El8/B3xemXciI65gjN9F4=',
};

function getConfLength() {
  const files = fs.readdirSync('/root').filter((name) => name.includes('.conf'));
  return files.length + 10;
};

async function getServerWgConfig(filePath) {
  const conf = await getConfigObjectFromFile({ filePath });
  return new WgConfig({ ...conf, filePath });
};

function createClientWgConfig(length, name) {
  return new WgConfig({
    wgInterface: {
      name: `Client ${name || length}`,
      dns: ['1.1.1.1', '1.0.0.1'],
      address: [`10.66.66.${length}/32`,`fd42:42:42::${length}/128`],
    },
    filePath: filePath(length),
  });
};

async function createNewClient(name) {
  const length = getConfLength()

  const server = await getServerWgConfig(serverFilePath)
  const client = createClientWgConfig(length, name)

  const { preSharedKey, publicKey } = await client.generateKeys({ preSharedKey: true });

  client.addPeer({
    ...clientPeer,
    preSharedKey
  });
  server.addPeer(
    client.createPeer({
      name: `Client ${name}`,
      allowedIps: [`10.66.66.${length}/32`,`fd42:42:42::${length}/128`],
      preSharedKey,
    }),
  );

  await client.writeToFile();
  await client.restart();
  await server.writeToFile();
  await server.restart();
  await client.down();

  return { path: filePath(length), key: publicKey };
};

async function checkOnline() {
  const config = await Wg.show();
  return Object.entries(config.wg0.peers).filter(([_, {latestHandshake}]) => latestHandshake > 0).map(([key, peer]) => {
    const { name, latestHandshake, persistentKeepalive } = peer;
    const date = new Date(latestHandshake * 1000);
    return {
      key,
      date: format(date, 'dd.MMMM.yyyy HH:mm'),
    };
  });
}

async function wgShow() {
  const config = await Wg.show()
  return Object.entries(config.wg0.peers).filter(([_, { endpoint }]) => !!endpoint).map(([key, peer]) => {
    const { latestHandshake, endpoint } = peer;
    console.log(peer);
    return {
      key,endpoint,
    };
  });
}



module.exports = {
  createNewClient,
  checkOnline,
  wgShow,
};
