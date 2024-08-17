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
  addOption:{
    type: OnlineInfoType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
    },
    resolve(parent,args) {
        let book = new Options({
            name:args.name,
        })
        return book.save()
    }
  }
};

module.exports = {
  userQueryFields,
  userMutationFields,
};

