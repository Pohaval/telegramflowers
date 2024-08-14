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
  // addOption:{
  //   type: BooOptionTypekType,
  //   args: {
  //       name: { type: new GraphQLNonNull(GraphQLString)},
  //       pages: { type: new GraphQLNonNull(GraphQLInt)},
  //   },
  //   resolve(parent,args) {
  //       let book = new Options({
  //           name:args.name,
  //           pages:args.pages,
  //       })
  //       return book.save()
  //   }
  // }
};

module.exports = {
  bookQueryFields,
  bookMutationFields,
};
