
const _ = require('lodash/core');

const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');


const wireguardApp = require('wireguard-rest');
wireguardApp.listen(1234, function(){
  console.log(`Wireguard API listening on port 1234`);
})

const path = require('path');
const fs = require('fs');
const { WgConfig, getConfigObjectFromFile  } = require('wireguard-tools');


// const files = fs.readdirSync('./').filter((name) => name.includes('newWg'));

// const promises = files.map(async (name) => {
//   const filePath = path.join(__dirname, name)
//   const thatConfigFromFile = await getConfigObjectFromFile({ filePath });
//   return thatConfigFromFile;
// })
// const f1 = async () => {
//   const res = await Promise.all(promises);
//   console.log(res);
// };
// f1();

const f = async (id) =>{
  const filePath = path.join('/root', `/newWg-${id}.conf`);
  const serverFilePath = path.join('/etc/wireguard', `/wg0.conf`);
  const serverConf = await getConfigObjectFromFile({ filePath: serverFilePath });
  const server = new WgConfig({
    ...serverConf,
    filePath,
  })
  const params = {
    wgInterface: {
      name: `Client ${id}`,
      address: [`10.66.66.${id}/32`,`fd42:42:42::${id}/128`],
      dns: ['1.1.1.1', '1.0.0.1'],
    },
    // peers: [
    //   {
    //     allowedIps: ['10.10.1.1/32'],
    //     publicKey: 'FoSq0MiHw9nuHMiJcD2vPCzQScmn1Hu0ctfKfSfhp3s=',
    //     endpoint: ['45.132.1.20:59372'],
    //   }
    // ],
    filePath,
  };
  const client = new WgConfig(params);
  await Promise.all([
    server.generateKeys({ preSharedKey: true }),
    client.generateKeys({ preSharedKey: true })
  ]);
  const serverAsPeer = server.createPeer({
    allowedIps: ['10.1.1.1/32'],
    preSharedKey: server.preSharedKey
  });
  client.addPeer(serverAsPeer);
  server.addPeer(client.createPeer({
    allowedIps: ['10.10.1.1/32'],
    preSharedKey: client.preSharedKey
  }))
  await client.writeToFile();
  await server.writeToFile();

  // const config = new WgConfig(params);
  // const { publicKey, preSharedKey, privateKey } = await config.generateKeys({ preSharedKey: true })
  // config.addPeer({
  //   allowedIps: ['0.0.0.0/0','::/0'],
  //   endpoint: ['45.132.1.20:59372'],
  //   publicKey: '7yIFNwTyAZT8jzJ80cmvv1El8/B3xemXciI65gjN9F4=',
  //   preSharedKey,
  // })
  // await config.writeToFile()
};
f(10);

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

require("dotenv").config();
const schema = require('./schema/index')
const app = express();

mongoose.connect('mongodb://localhost:27017/telegramflowers')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

const { bot } = require("./telegram");
const { rootCertificates } = require('tls');
bot.start().then('open', () => {
  console.log('botStart');
});


app.use(express.json());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: "false",
//     message: "Page not found",
//     error: {
//       statusCode: 404,
//       message: "You reached a route that is not defined on this server",
//     },
//   });
// });

app.listen(3000, () => { console.log('Listening on port 3000'); });
module.exports = app;
