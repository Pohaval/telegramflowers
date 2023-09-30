const graphql = require('graphql');
const Book = require('../models/book');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt,
    GraphQLList,GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        pages: { type: GraphQLInt },
    })
});

const bookQueryFields = {
  book: {
    type: BookType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
        return Book.findById(args.id);
    }
  },
  books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
          return Book.find({});
      }
  },
};

const bookMutationFields = {
  addBook:{
    type: BookType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        pages: { type: new GraphQLNonNull(GraphQLInt)},
    },
    resolve(parent,args) {
        let book = new Book({
            name:args.name,
            pages:args.pages,
        })
        return book.save()
    }
  }
};

module.exports = {
  bookQueryFields,
  bookMutationFields,
};
