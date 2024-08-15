const OnlineInfo = require('../models/onlineInfo');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


const OnlineInfoType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      age: { type: GraphQLInt },
  })
})

const userQueryFields = {
  onlineInfo: {
    type: new GraphQLList(OnlineInfoType),
    resolve(parent, args) {
        return OnlineInfo.find({});
    },
  },
};

const userMutationFields = {
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

