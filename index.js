
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');


const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/index')
const { setIntervalGetInfo } = require('./middleware/onlineInfo');
const app = express();

mongoose.connect('mongodb://localhost:27017/telegramflowers')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

const { bot } = require("./telegram/vpn");
const { rootCertificates } = require('tls');
bot.start().then('open', () => {
  console.log('botStart');
});


app.use(express.json());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

setIntervalGetInfo()
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


// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
