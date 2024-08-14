const { GraphQLObjectType,  GraphQLSchema } = require('graphql');

const { userQueryFields, userMutationFields } = require("./userTelegramSchema");
const { bookQueryFields, bookMutationFields } = require("./optionSchema");

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
