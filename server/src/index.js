const { GraphQLServer } = require("graphql-yoga");

// dummy data
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  },
  {
    id: "link-1",
    url: "old.reddit.com/",
    description: "Time wasting site"
  }
];

// 2
let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    // 2
    feed: () => links,
    link: (obj, args, context) => {
      return links.find(link => link.id === args.id);
    }
  },
  Mutation: {
    post: async (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      await links.push(link);
      return link;
    },
    updateLink: async (_, { id, url, description }) => {
      const link = await links.find(link => link.id === id);
      if (!link["id"]) {
        throw new Error("no message exists with id " + id);
      }
      if (url) {
        link.url = url;
      }
      if (description) {
        link.description = description;
      }
      return link;
    },
    deleteLink: async (_, { id }) => {
      const link = await links.find(link => link.id === id);
      if (!link["id"]) {
        throw new Error("no message exists with id " + id);
      }
      await link.remove;
      return link;
    }
  },
  // 3
  Link: {
    id: root => root.id,
    description: root => root.description,
    url: root => root.url
  }
};

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
