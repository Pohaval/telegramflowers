const graphql = require('graphql');
const Options = require('../models/options');

const {
    GraphQLObjectType, GraphQLString, GraphQLBoolean,
    GraphQLID, GraphQLInt,
    GraphQLList,GraphQLNonNull
} = graphql;

const OptionType = new GraphQLObjectType({
  name: 'Option',
  fields: () => ({
    // id: { type: GraphQLID  },
    canCreateNewConfig: { type: GraphQLBoolean },
    // pages: { type: GraphQLInt },
  })
});

const bookQueryFields = {
  // book: {
  //   type: OptionType,
  //   args: { id: { type: GraphQLID } },
  //   resolve(parent, args) {
  //       return Book.findById(args.id);
  //   }
  // },
  option: {
    type: OptionType,
    resolve(parent, args) {
      return Options.find({});
    }
  },
};

const bookMutationFields = {
  addOption:{
    type: OptionType,
    args: {
      canCreateNewConfig: { type: new GraphQLNonNull(GraphQLBoolean)},
    },
    resolve(parent,args) {
        let book = new Options({
          canCreateNewConfig:args.canCreateNewConfig,
        })
        return book.save()
    }
  }
};

module.exports = {
  bookQueryFields,
  bookMutationFields,
};
