
const _ = require('lodash/core');

const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const wireguardApp = require('wireguard-rest');
wireguardApp.listen(1234, function(){
  console.log(`Wireguard API listening on port 1234`);
})
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

app.listen(8080, () => { console.log('Listening on port 3000'); });
module.exports = app;
