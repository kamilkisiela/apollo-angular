const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
  apolloExpress,
  graphiqlExpress
} = require('apollo-server');

const {
  makeExecutableSchema
} = require('graphql-tools');

const {
  schema,
  resolvers
} = require('./schema');

const PORT = 4300;
const app = express();

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/graphql', apolloExpress((req) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  return {
    schema: executableSchema
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

app.listen(PORT, () => console.log(
  `API Server is now running on http://localhost:${PORT}`
));