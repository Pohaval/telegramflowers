const User = require('../models/user');
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
      age: { type: GraphQLInt },
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
        age: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parent, args) {
        let user = new User({
            name: args.name,
            age: args.age
        });
        return user.save();
    }
  },
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

