import React, { createContext, useContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

import Controller from './Controller';
import { reducer } from './Reducer';

/**
 * Types to filter Todos by.
 *
 * @type {{COMPLETED_TODOS: string, ACTIVE_TODOS: string, ALL_TODOS: string}}
 */
const filters = {
  ACTIVE_TODOS: 'active',
  ALL_TODOS: 'all',
  COMPLETED_TODOS: 'completed',
};

const Context = createContext();

// COMPONENTS

/**
 * Establishes the context provision of singleton state and controller.
 *
 *
 *
 * @returns {Context.Provider} a context provider instance
 * @constructor
 */
function TodoViewModel({ initialState, apolloClient, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const controller = useMemo(() => {
    return new Controller(dispatch, apolloClient);
  }, [dispatch, apolloClient]);

  return <Context.Provider value={[state, controller]}>{children}</Context.Provider>;
}

TodoViewModel.propTypes = {
  apolloClient: PropTypes.any,
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
 * @returns {[Object, Controller]} the state and view controller
 */
export function useTodoViewModel() {
  return useContext(Context);
}

export { filters };
