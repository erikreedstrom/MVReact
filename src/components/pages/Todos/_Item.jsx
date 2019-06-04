import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { usePrevious } from '@todomvc/hooks';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

// HANDLERS

const handleSubmit = ([editText, setEditText], { onSave, onDestroy }) => _event => {
  let val = editText.trim();
  if (val) {
    onSave(val);
    setEditText(val);
  } else {
    onDestroy();
  }
};

const handleEdit = (setEditText, { todo, onEdit }) => () => {
  onEdit();
  setEditText(todo.title);
};

const handleKeyDown = (setEditText, handleSubmit, { todo, onCancel }) => event => {
  if (event.which === ESCAPE_KEY) {
    setEditText(todo.title);
    onCancel(event);
  } else if (event.which === ENTER_KEY) {
    handleSubmit(event);
  }
};

const handleChange = (setEditText, { editing }) => event => {
  if (editing) {
    setEditText(event.target.value);
  }
};

// COMPONENTS

/**
 * Provides a list item component rendering the `Todo` item.
 *
 * @param {Object} props - the component props
 * @param {Todo} props.todo - the todo item
 * @param {boolean} props.editing - true if item being edited
 * @param {Function} props.onCancel - the cancel editing handler
 * @param {Function} props.onDestroy - the delete item handler
 * @param {Function} props.onEdit - the edit item handler
 * @param {Function} props.onSave - the save item handler
 * @param {Function} props.onToggle - the toggle item handler
 */
const Item = ({ todo, editing, onCancel, onDestroy, onEdit, onSave, onToggle }) => {
  const inputRef = useRef();
  const [editText, setEditText] = useState(todo.title);

  const prevEditing = usePrevious(editing);
  useEffect(() => {
    if (!prevEditing && editing) {
      const node = inputRef.current;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }, [prevEditing, editing]);

  const memoHandleEdit = useCallback(handleEdit(setEditText, { todo, onEdit }));

  const memoHandleSubmit = useCallback(handleSubmit([editText, setEditText], { onSave, onDestroy }), [
    editText,
    setEditText,
    onSave,
    onDestroy,
  ]);

  const memoHandleChange = useCallback(handleChange(setEditText, { editing }), [setEditText, editing]);

  const memoHandleKeydown = useCallback(handleKeyDown(setEditText, memoHandleSubmit, { todo, onCancel }), [
    setEditText,
    memoHandleSubmit,
    todo,
    onCancel,
  ]);

  return (
    <li className={classNames({ completed: todo.completed, editing: editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={memoHandleEdit}>{todo.title}</label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={editText}
        onBlur={memoHandleSubmit}
        onChange={memoHandleChange}
        onKeyDown={memoHandleKeydown}
      />
    </li>
  );
};

Item.displayName = 'TodoItem';

Item.propTypes = {
  todo: PropTypes.object,
  editing: PropTypes.bool,
  onCancel: PropTypes.func,
  onDestroy: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onToggle: PropTypes.func,
};

Item.defaultProps = {
  todo: null,
  editing: false,
  onCancel: () => {},
  onDestroy: () => {},
  onEdit: () => {},
  onSave: () => {},
  onToggle: () => {},
};

// PUBLIC API

export default React.memo(Item, (prev, next) => {
  // Only rerender if `todo` or `editing` has changed.
  // This is a naive check, but works for our purposes.
  return prev.todo === next.todo && prev.editing === next.editing;
});
