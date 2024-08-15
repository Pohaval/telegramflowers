const User = require('../models/userTelegram');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNumber,
  GraphQLID,
  GraphQLInt,
  GraphQLArray,
  GraphQLList,
} = require('graphql');


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      telegram_id: { type: GraphQLString },
      history: ({ type: GraphQLInt }),
  })
})

const userQueryFields = {
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
        return User.findById(args.id);
    },
  },
  users: {
    type: new GraphQLList(UserType),
    resolve(parent, args) {
        return User.find({});
    },
  },
};

const userMutationFields = {
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

