const globals = require('./globals');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/dbConfig')
const logger = require('./config/logger')

const app = express();

// Allow cross origing request
app.use(cors());

// Database Connection
mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true });

mongoose.connection.once('open',()=>{
  logger.info('Connected to the DB.');
})

app.use('/graphql', graphqlHTTP(req => {
  return {
    schema: schema,
    context: {
      userId: req.headers.userid
    },
    graphiql: true
  }
}))


app.listen(4002, ()=>{
  logger.info('now listening on port 4002.');
});
