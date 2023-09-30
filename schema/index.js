const { GraphQLObjectType,  GraphQLSchema } = require('graphql');

const { userQueryFields, userMutationFields } = require("./userSchema");
const { bookQueryFields, bookMutationFields } = require("./bookSchema");

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...userQueryFields,
    ...bookQueryFields,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutationFields,
    ...bookMutationFields,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation:Mutation,
});
