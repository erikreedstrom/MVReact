import React from 'react';
import { Link } from 'react-router5';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pluralize from 'pluralize';

import { pathNames } from '@todomvc/router';
import { filters } from '@todomvc/view_models/TodoViewModel';

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

const Footer = React.memo(({ count, completedCount, nowShowing, ...props }) => {
  if (!count && !completedCount) return null;

  const activeTodoWord = pluralize('item', count);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link className={classNames({ selected: nowShowing === filters.ALL_TODOS })} routeName={pathNames.TODOS}>
            All
          </Link>
        </li>{' '}
        <li>
          <Link
            className={classNames({ selected: nowShowing === filters.ACTIVE_TODOS })}
            routeName={pathNames.TODOS_ACTIVE}>
            Active
          </Link>
        </li>{' '}
        <li>
          <Link
            className={classNames({ selected: nowShowing === filters.COMPLETED_TODOS })}
            routeName={pathNames.TODOS_COMPLETED}>
            Completed
          </Link>
        </li>
      </ul>
      {ClearButton({ ...props })}
    </footer>
  );
});

Footer.propTypes = {
  count: PropTypes.number,
  nowShowing: PropTypes.string,
};

Footer.defaultProps = {
  count: 0,
  nowShowing: filters.ALL_TODOS,
};

export default Footer;
