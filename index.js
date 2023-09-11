const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/telegramflowers')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
