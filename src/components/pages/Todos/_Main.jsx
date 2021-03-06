import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import TodoItem from '@todomvc/components/pages/Todos/_Item';
import { filters } from '@todomvc/view_models/TodoViewModel';

// METHODS

const shownTodos = (todos, nowShowing) => {
  return todos.filter(todo => {
    switch (nowShowing) {
      case filters.ACTIVE_TODOS:
        return !todo.completed;
      case filters.COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });
};

// HANDLERS

// COMPONENTS

/**
 * Provides a page component partial including the todo list.
 *
 * @param {Object} props - the component props
 * @param {Controller} props.controller - the view controller
 * @param {[Todo]} props.todos - the list of todos
 * @param {Number} props.activeTodoCount - the number of uncompleted todos
 * @param {string} props.nowShowing - the current filter set
 * @param {Function} props.toggleAll - the toggleAll handler
 */
const Main = ({ controller, todos, activeTodoCount, nowShowing, toggleAll }) => {
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    return shownTodos(todos, nowShowing);
  }, [todos, nowShowing]);

  if (todos.length <= 0) return null;

  const todoItems = filtered.map(todo => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        editing={editing === todo.id}
        onToggle={() => controller.toggleTodo(todo)}
        onDestroy={() => controller.destroyTodo(todo)}
        onEdit={() => setEditing(todo.id)}
        onSave={title => {
          controller.saveTodo(todo, title);
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
    );
  });

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        onChange={toggleAll}
        checked={activeTodoCount === 0}
      />
      <label htmlFor="toggle-all" />
      <ul className="todo-list">{todoItems}</ul>
    </section>
  );
};

Main.propTypes = {
  controller: PropTypes.any,
  todos: PropTypes.arrayOf(PropTypes.object),
  activeTodoCount: PropTypes.number,
  nowShowing: PropTypes.string,
  toggleAll: PropTypes.func,
};

Main.defaultProps = {
  controller: null,
  todos: [],
  activeTodoCount: 0,
  nowShowing: filters.ALL_TODOS,
  toggleAll: () => {},
};

Main.displayName = 'TodosMain';

// PUBLIC API

export default Main;
