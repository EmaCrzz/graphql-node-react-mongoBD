const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./server/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow corss-origin request
app.use(cors()); 

mongoose.connect('mongodb://admin:admin1234@ds161024.mlab.com:61024/gql-crzz');
mongoose.connection.once('open', () => {
	console.log('Conectado a la DB');
})

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true
}));

app.listen(4000, ()=> {
	console.log('servidor corriendo OK');
});
