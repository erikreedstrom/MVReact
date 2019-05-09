import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { reducer } from './Reducer';

const filters = {
  ACTIVE_TODOS: 'active',
  ALL_TODOS: 'all',
  COMPLETED_TODOS: 'completed',
};

const Context = createContext();

/**
 * Converts user actions to business actions, communicating with external services.
 */
class Controller {
  constructor(dispatch) {
    this._dispatch = dispatch;
  }

  toggleAllTodos(checked) {
    this._dispatch({ type: 'toggleAll', checked });
  }

  toggleTodo(todo) {
    this._dispatch({ type: 'toggle', todo });
  }

  addTodo(title) {
    this._dispatch({ type: 'addTodo', title });
  }

  destroyTodo(todo) {
    this._dispatch({ type: 'destroy', todo });
  }

  saveTodo(todo, text) {
    this._dispatch({ type: 'save', todo, text });
  }

  clearCompleted() {
    this._dispatch({ type: 'clearCompleted' });
  }
}

// COMPONENTS

/**
 * Establishes the context provision of singleton state and controller.
 */
function TodoViewModel({ initialState, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const controller = new Controller(dispatch);
  return <Context.Provider value={[state, controller]}>{children}</Context.Provider>;
}

TodoViewModel.propTypes = {
  initialState: PropTypes.object,
  children: PropTypes.element,
};

TodoViewModel.defaultProps = {
  initialState: null,
  children: null,
};

// PUBLIC API

export default TodoViewModel;

/**
 * Hook for providing view controller and current state.
 *
 * @returns {[object, Controller]} the state and view controller
 */
export function useTodoViewModel() {
  return useContext(Context);
}

export { Controller, filters };
