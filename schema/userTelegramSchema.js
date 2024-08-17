const User = require('../models/userTelegram');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNumber,
  GraphQLNonNull,
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
  addOption:{
    type: UserType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        // pages: { type: new GraphQLNonNull(GraphQLInt)},
    },
    resolve(parent,args) {
        let book = new Options({
            name:args.name,
            // pages:args.pages,
        })
        return book.save()
    }
  }
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

