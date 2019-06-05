/**
 * Provides state management for the TodoViewModel.
 *
 * The reducer defines how new state should merge into existing state.
 * It does this through handling events dispatched from the view controller.
 */
class Reducer {
  /**
   * Replaces existing `todos` in the component state with a new list.
   *
   * @param {Object} state - the current state of the page component
   * @param {[Object]} todos - the updated list of todos
   *
   * @returns {{todos: *}} the state with updated todos
   */
  static todosUpdated(state, { todos }) {
    return { ...state, todos };
  }
}

// PUBLIC API

/**
 * Provides a reducer function to pass to `useReducer`.
 *
 * All events dispatched to the reducer function are delegated to
 * the Reducer class as static methods.
 *
 * @param {Object} state - the current state of the page component
 * @param {Object} event - a dispatched event
 * @param {string} event.type - the event type
 * @param {Object} [event.args] - additional event parameters
 *
 * @returns {Object} the updated state
 */
export function reducer(state, { type, ...args }) {
  return Reducer[type].call({}, state, args);
}
