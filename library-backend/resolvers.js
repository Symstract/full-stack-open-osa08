const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filters = {};

      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author });
        filters.author = foundAuthor._id;
      }

      if (args.genre) {
        filters.genres = args.genre;
      }

      return Book.find(filters).populate("author");
    },
    allAuthors: async () => Author.find({}),
    allGenres: async () => {
      const genres = await Book.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: "$genres" } },
        { $sort: { _id: 1 } },
      ]);

      return genres.map((genre) => genre._id);
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User(args);

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const book = new Book({ ...args, author });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;
      author.save();

      return author;
    },
  },
  Author: {
    bookCount: async (root) => {
      return batchAuthorBookCounts.load(root._id);
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
