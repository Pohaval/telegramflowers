
const express = require("express");
const _ = require('lodash/core');
const { graphqlHTTP } = require('express-graphql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
// const User = require('./models/user');

require("dotenv").config();
const schema = require('./schema/index')
const app = express();

const { bot } = require("./middleware/telegram");
console.log(bot)
bot.start();

mongoose.connect('mongodb://localhost:27017/telegramflowers')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use(express.json());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
app.listen(3000, () => {
    console.log('Listening on port 3000');
});


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

module.exports = app;
