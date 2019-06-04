import React from 'react';
import { Link } from 'react-router5';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pluralize from 'pluralize';

import { pathNames } from '@todomvc/router';
import { filters } from '@todomvc/view_models/TodoViewModel';

// COMPONENTS

/**
 * Provides a button component to clear all completed todos.
 */
const ClearButton = ({ completedCount, onClearCompleted }) => {
  if (completedCount <= 0) return null;

  return (
    <button className="clear-completed" onClick={onClearCompleted}>
      Clear completed
    </button>
  );
};

ClearButton.propTypes = {
  completedCount: PropTypes.number,
  onClearCompleted: PropTypes.func,
};

ClearButton.defaultProps = {
  completedCount: 0,
  onClearCompleted: () => {},
};

// A memoized `Link` to ensure we don't constantly rerender in the footer when typing
const MemoLink = React.memo(Link, (prev, next) => {
  return ['className', 'routeName', 'children'].reduce((memo, key) => memo && prev[key] === next[key], true);
});

/**
 * Provides a page component partial including the todo list.
 *
 * @param {Object} - the component props
 * @param {Number} props.count - the total number of todos
 * @param {Number} props.completedCount - the number of completed todos
 * @param {string} props.nowShowing - the current filter set
 * @param {Object} props.props - additional
 */
const Footer = ({ count, completedCount, nowShowing, ...props }) => {
  if (!count && !completedCount) return null;

  const activeTodoWord = pluralize('item', count);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <MemoLink className={classNames({ selected: nowShowing === filters.ALL_TODOS })} routeName={pathNames.TODOS}>
            All
          </MemoLink>
        </li>{' '}
        <li>
          <MemoLink
            className={classNames({ selected: nowShowing === filters.ACTIVE_TODOS })}
            routeName={pathNames.TODOS_ACTIVE}>
            Active
          </MemoLink>
        </li>{' '}
        <li>
          <MemoLink
            className={classNames({ selected: nowShowing === filters.COMPLETED_TODOS })}
            routeName={pathNames.TODOS_COMPLETED}>
            Completed
          </MemoLink>
        </li>
      </ul>
      {ClearButton({ ...props })}
    </footer>
  );
};

Footer.propTypes = {
  completedCount: PropTypes.number,
  count: PropTypes.number,
  nowShowing: PropTypes.string,
};

Footer.defaultProps = {
  count: 0,
  completedCount: 0,
  nowShowing: filters.ALL_TODOS,
};

Footer.displayName = 'TodosFooter';

export default React.memo(Footer, (prev, next) => {
  return Object.keys(Footer.propTypes).reduce((memo, key) => memo && prev[key] === next[key], true);
});
