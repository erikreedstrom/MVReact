/* eslint-disable no-console */
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { makeExecutableSchema } from 'graphql-tools';
import gql from 'graphql-tag';
import uuid from 'uuid/v4';

// Provides a mock API implementation
//
// The `Store` utilizes `localStorage`
class Store {
  static get todos() {
    return JSON.parse(localStorage.getItem('todos') || null) || [];
  }

  static createTodo({ title }) {
    const todo = {
      id: uuid(),
      title: title,
      completed: false,
    };
    const todos = Store.todos.concat(todo);

    localStorage.setItem('todos', JSON.stringify(todos));
    return todo;
  }

  static destroyTodo(id) {
    const todo = Store.todos.find(todo => todo.id === id);
    const todos = Store.todos.filter(todo => todo.id !== id);

    localStorage.setItem('todos', JSON.stringify(todos));
    return todo;
  }

  static clearCompletedTodos() {
    const todos = Store.todos.filter(todo => !todo.completed);

    localStorage.setItem('todos', JSON.stringify(todos));
    return todos;
  }

  static toggleAllTodos(checked) {
    const todos = Store.todos.map(todo => {
      return Object.assign({}, todo, { completed: checked });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    return todos;
  }

  static toggleTodo(id) {
    let updated;
    const todos = Store.todos.map(todo => {
      if (todo.id !== id) return todo;

      updated = Object.assign({}, todo, { completed: !todo.completed });
      return updated;
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    return updated;
  }

  static updateTodo(id, title) {
    let updated;
    const todos = Store.todos.map(todo => {
      if (todo.id !== id) return todo;

      updated = Object.assign({}, todo, { title });
      return updated;
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    return updated;
  }
}

const cache = new InMemoryCache();

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String
    completed: Boolean!
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    toggleAllTodos(checked: Boolean): [Todo]
    toggleTodo(id: ID!): Todo
    clearCompletedTodos: [Todo]
    createTodo(title: String!): Todo
    destroyTodo(id: ID!): Todo
    updateTodo(id: ID!, title: String): Todo
  }
`;

// Mock Apollo Server using localStorage for backing
const resolvers = {
  Query: {
    todos: () => Store.todos,
  },
  Mutation: {
    toggleAllTodos: (_, { checked }) => Store.toggleAllTodos(checked),
    toggleTodo: (_, { id }) => Store.toggleTodo(id),
    clearCompletedTodos: () => Store.clearCompletedTodos(),
    createTodo: (_, attrs) => Store.createTodo(attrs),
    destroyTodo: (_, { id }) => Store.destroyTodo(id),
    updateTodo: (_, { id, title }) => Store.updateTodo(id, title),
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const link = new SchemaLink({ schema: executableSchema });
const client = new ApolloClient({ link, cache });

export default { client };
