const User = require('../models/userTelegram');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// const {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLID,
//   GraphQLInt,
//   GraphQLList,
//   GraphQLNonNull
// } = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      telegram_id: { type: GraphQLString },
      history: { type: GraphQLArray },
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
  addAUser: {
    type: UserType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        telegram_id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
        let user = new User({
            name: args.name,
            telegram_id: args.telegram_id
        });
        return user.save();
    }
  },
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

