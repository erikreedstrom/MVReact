import ClearCompletedTodos from '@todomvc/services/graphql/mutations/todo/ClearCompletedTodos.graphql';
import CreateTodo from '@todomvc/services/graphql/mutations/todo/CreateTodo.graphql';
import DestroyTodo from '@todomvc/services/graphql/mutations/todo/DestroyTodo.graphql';
import ToggleAllTodos from '@todomvc/services/graphql/mutations/todo/ToggleAllTodos.graphql';
import ToggleTodo from '@todomvc/services/graphql/mutations/todo/ToggleTodo.graphql';
import UpdateTodo from '@todomvc/services/graphql/mutations/todo/UpdateTodo.graphql';
import Todos from '@todomvc/services/graphql/queries/todo/Todos.graphql';

/**
 * A todo item.
 *
 * @typedef Todo
 * @property {string} id - the todo id
 * @property {string} title - the todo id
 * @property {boolean} completed - true if the todo is complete
 */

/**
 * @function Controller~dispatch
 * @param {FiberNode} fiber
 * @param {Object} queue
 * @param {{type: string}} action
 */

/**
 * Converts user actions to business actions, communicating with external services.
 */
class Controller {
  /**
   * Instantiates a `Controller` instance and sets up an observable query for `Todos`.
   *
   * @param {Controller~dispatch} dispatch - the React `dispatchAction` used by the reducer
   * @param {ApolloClient} apolloClient - the graphql client
   *
   * @constructor
   */
  constructor(dispatch, apolloClient) {
    this._dispatch = dispatch;
    this._apolloClient = apolloClient;

    // Setup watcher to update state when Todos change outside of scope.
    //
    // Since Apollo will refetch on certain mutations, we can simply observe and allow
    // the subscription to handle the local state update.
    this._apolloClient.watchQuery({ query: Todos }).subscribe(({ data, loading, networkStatus }) => {
      if (loading || networkStatus === 4) {
        console.debug('TodoViewModel.Todos ===> loading');
        // If we were tracking loading state, we could dispatch an event to
        // handle the loading state, however, we'll just noop.
        return;
      }

      if (data) {
        console.debug('TodoViewModel.Todos', data);
        this._dispatch({ type: 'todosUpdated', todos: data.todos });
      }
    });
  }

  // NOTE: Most of the following methods simply refetchQueries, which will automatically
  // update view state do to the watchQuery. It can be much more performant to optimize
  // utilizing optimistic updates and direct updates to the Apollo cache layer.

  /**
   * Sets all todos on the remote store to the value of `checked`.
   *
   * @param {boolean} checked - true if setting to complete
   */
  toggleAllTodos(checked) {
    this._apolloClient
      .mutate({ mutation: ToggleAllTodos, variables: { checked }, refetchQueries: ['Todos'] })
      .then(({ data }) => {
        console.debug('TodoViewModel.toggleAllTodos', data);
      })
      .catch(error => {
        console.error('TodoViewModel.toggleAllTodos', error);
      });
  }

  /**
   * Toggles a todo on the remote store.
   *
   * @param {Todo} todo - the todo instance
   */
  toggleTodo(todo) {
    this._apolloClient
      .mutate({ mutation: ToggleTodo, variables: { id: todo.id } })
      .then(({ data }) => {
        console.debug('TodoViewModel.toggleTodo', data);
      })
      .catch(error => {
        console.error('TodoViewModel.toggleTodo', error);
      });
  }

  /**
   * Create a new todo on the remote store.
   *
   * @param {string} title - the todo title
   */
  addTodo(title) {
    this._apolloClient
      .mutate({ mutation: CreateTodo, variables: { title }, refetchQueries: ['Todos'] })
      .then(({ data }) => {
        console.debug('TodoViewModel.addTodo', data);
      })
      .catch(error => {
        console.error('TodoViewModel.addTodo', error);
      });
  }

  /**
   * Delete todo from the remote store.
   *
   * @param {Todo} todo - the todo instance
   */
  destroyTodo(todo) {
    this._apolloClient
      .mutate({
        mutation: DestroyTodo,
        variables: { id: todo.id },
        update: (store, { data: { destroyTodo } }) => {
          // Rewrite the query to remove the item from the previous response
          // This triggers the watchQuery, so similar to refetch without the refetch
          const data = store.readQuery({ query: Todos });
          data.todos = data.todos.filter(node => node.id !== destroyTodo.id);

          store.writeQuery({ query: Todos, data });

          // Remove the record from cache
          //
          // We could skip this, but a clean cache is a fast cache.
          // https://github.com/apollographql/apollo-feature-requests/issues/5#issuecomment-491029091
          store.data.delete(`Todo:${destroyTodo.id}`);
        },
      })
      .then(({ data }) => {
        console.debug('TodoViewModel.destroyTodo', data);
      })
      .catch(error => {
        console.error('TodoViewModel.destroyTodo', error);
      });
  }

  /**
   * Update todo with provided title on the remote store.
   *
   * @param {Todo} todo - the todo instance
   * @param {string} text - the updated title
   */
  saveTodo(todo, text) {
    this._apolloClient
      .mutate({ mutation: UpdateTodo, variables: { id: todo.id, title: text } })
      .then(({ data }) => {
        console.debug('TodoViewModel.saveTodo', data);
      })
      .catch(error => {
        console.error('TodoViewModel.saveTodo', error);
      });
  }

  /**
   * Clear completed todos from the remote store.
   */
  clearCompleted() {
    this._apolloClient
      .mutate({ mutation: ClearCompletedTodos, refetchQueries: ['Todos'] })
      .then(({ data }) => {
        console.debug('TodoViewModel.clearCompleted', data);
      })
      .catch(error => {
        console.error('TodoViewModel.clearCompleted', error);
      });
  }
}

export default Controller;
