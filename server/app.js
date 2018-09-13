const globals = require('./globals');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const checkJwt = require('./auth/middleware/jwt');

const app = express();

// Allow cross origing request
app.use(cors());

// Database Connection
mongoose.connect('mongodb://exchange:admin123@ds143932.mlab.com:43932/exchangedb',
  { useNewUrlParser: true });

mongoose.connection.once('open',()=>{
  console.log('Connected to the DB.');
})

/* Here we bind all requests to this endpoint to be procecced by the GraphQL Library. */


app.post('/graphql', checkJwt, (err, req, res, next) => {
    if (err) return res.status(401).send(`[Authenticate Token Error] ${err.message}`);
    next();
  }
);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: false,
  context: req => ({ ...req })
}));


app.listen(4002, ()=>{
  console.log('now listening on port 4002.');
});
