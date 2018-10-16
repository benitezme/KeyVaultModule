const globals = require('./globals');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const AUTH_CONFIG = require('./auth/Auth0');
const dbConfig = require('./auth/dbConfig')

const app = express();

// Allow cross origing request
app.use(cors());

// Database Connection
mongoose.connect(dbConfig.connectionString, { useNewUrlParser: true });

mongoose.connection.once('open',()=>{
  console.log('Connected to the DB.');
})

/* Here we bind all requests to this endpoint to be procecced by the GraphQL Library. */


app.use('/graphql',
  jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 1,
      jwksUri: `https://${AUTH_CONFIG.domain}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    credentialsRequired: false,
    audience: AUTH_CONFIG.api_audience,
    issuer: AUTH_CONFIG.issuer,
    algorithms: [`RS256`]
  }),
  function (req, res, next) {
    if (!req.user){
      let error = {
        error:'Authentication Error'
      }
      return res.status(401).send(error)
    } else {
      return next()
    }
  }
);

app.use('/graphql', graphqlHTTP(req => {
  return {
    schema: schema,
    context: { user: req.user },
    graphiql: true
  }
}))


app.listen(4002, ()=>{
  console.log('now listening on port 4002.');
});
