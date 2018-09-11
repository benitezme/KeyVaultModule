const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross origing request
app.use(cors());

mongoose.connect('mongodb://exchange:admin123@ds143932.mlab.com:43932/exchangedb',
  { useNewUrlParser: true });

mongoose.connection.once('open',()=>{
  console.log('Connected to the DB.');
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4002, ()=>{
  console.log('now listening on port 4002.');
});
