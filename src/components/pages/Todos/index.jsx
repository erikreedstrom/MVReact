import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from 'react-router5';

import { pathNames } from '@todomvc/router';
import Footer from '@todomvc/components/pages/Todos/_Footer';
import Main from '@todomvc/components/pages/Todos/_Main';
import { filters, useTodoViewModel } from '@todomvc/view_models/TodoViewModel';

const ENTER_KEY = 13;

// HANDLERS

const handleChange = setNewTodo => event => {
  setNewTodo(event.target.value);
};

const handleNewTodoKeyDown = ([newTodo, setNewTodo], controller) => event => {
  if (event.keyCode !== ENTER_KEY) return;
  event.preventDefault();

  const title = newTodo.trim();

  if (title) {
    controller.addTodo(title);
    setNewTodo('');
  }
};

const filterForRoute = ({ name }) => {
  switch (name) {
    case pathNames.TODOS_ACTIVE:
      return filters.ACTIVE_TODOS;
    case pathNames.TODOS_COMPLETED:
      return filters.COMPLETED_TODOS;
    default:
      return filters.ALL_TODOS;
  }
};

// COMPONENTS

/**
 * Provides a page component for Todos.
 *
 * This page must be wrapped in a `TodoViewModel`, which provides the view controller
 * and the state reducer.
 *
 * @example
 *
 * <TodosViewModel initialState={{ todos: [] }} apolloClient={apolloClient}>
 *   <Todos />
 * </TodosViewModel>
 *
 */
const Todos = () => {
  const { route } = useRoute();

  const [{ todos }, controller] = useTodoViewModel();

  const [newTodo, setNewTodo] = useState('');
  const [nowShowing, setNowShowing] = useState(filters.ALL_TODOS);

  useEffect(() => {
    setNowShowing(filterForRoute(route));
  }, [route]);

  const memoHandleChange = useCallback(handleChange(setNewTodo), [setNewTodo]);
  const memoHandleNewTodoKeyDown = useCallback(handleNewTodoKeyDown([newTodo, setNewTodo], controller), [
    newTodo,
    setNewTodo,
    controller,
  ]);

  const activeTodoCount = todos.reduce((acc, todo) => (todo.completed ? acc : acc + 1), 0);
  const completedCount = todos.length - activeTodoCount;

  const toggleDir = completedCount - activeTodoCount <= 0;

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          type="text"
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onKeyDown={memoHandleNewTodoKeyDown}
          onChange={memoHandleChange}
          autoFocus={true}
        />
      </header>
      <Main
        controller={controller}
        todos={todos}
        activeTodoCount={activeTodoCount}
        nowShowing={nowShowing}
        toggleAll={() => controller.toggleAllTodos(toggleDir)}
      />
      <Footer
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={() => controller.clearCompleted()}
      />
    </div>
  );
};

// PUBLIC API

export default Todos;
