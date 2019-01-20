const graphql = require('graphql');
const lodash = require('lodash');
const { 
	GraphQLObjectType,
	GraphQLString, 
	GraphQLID, 
	GraphQLSchema,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;
const Book = require('../models/book');
const Author = require('../models/author');


// datos staticos
// var books = [
// 	{name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1'},
// 	{name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
// 	{name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
// 	{name: 'The Hero of Ages', genre: 'Fantasy', id: '3', authorId: '2'},
// 	{name: 'The Colour of Magic', genre: 'Fantasy', id: '3', authorId: '3'},
// 	{name: 'The Lingth Fantastic', genre: 'Fantasy', id: '3', authorId: '3'},
// ]

// var authors = [
// 	{name: 'Patrick Rothfuss', age: 68, id: '1'},
// 	{name: 'Brandom Sanderson', age: 48, id: '2'},
// 	{name: 'Terry Pratchett', age: 58, id: '3'},
// ]
// datos staticos

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: { 
			type: AuthorType,
			resolve(parent, args){
				// return lodash.find(authors, {id: parent.authorId}); // para los datos estaticos
				return Author.findById(parent.authorId);
			}
		}
	})
});


const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: {type: GraphQLID},
		age: {type: GraphQLInt},
		name: {type: GraphQLString},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				// return lodash.filter(books, { authorId: parent.id }); // para los datos estaticos
				return Book.find({authorId: parent.id});
			}
		}
	})
});


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args){
				// codigo para obtener datos de la db/datos staticos
				// return lodash.find(books, {id: args.id}); // para los datos estaticos
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args){
				// codigo para obtener datos de la db/datos staticos
				// return lodash.find(authors, {id: args.id}); // para los datos estaticos
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args){
				return Book.find({});
			}
		},			
		authors: {
			type: new  GraphQLList(AuthorType),
			resolve(parent, args){
				// return authors; // para los datos estaticos
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent, args){
				let author = new Author({
					name: args.name,
					age: args.age
				});
				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				authorId: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent, args){
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery, 
	mutation: Mutation
});

