import uuid from 'uuid/v4';

class Reducer {
  static addTodo(state, { title }) {
    const todos = state.todos.concat({
      id: uuid(),
      title: title,
      completed: false,
    });

    return { ...state, todos };
  }

  static toggleAll(state, { checked }) {
    const todos = state.todos.map(todo => {
      return Object.assign({}, todo, { completed: checked });
    });

    return { ...state, todos };
  }

  static toggle(state, { todo: todoToToggle }) {
    const todos = state.todos.map(todo => {
      return todo !== todoToToggle ? todo : Object.assign({}, todo, { completed: !todo.completed });
    });

    return { ...state, todos };
  }

  static destroy(state, { todo }) {
    const todos = state.todos.filter(candidate => candidate !== todo);

    return { ...state, todos };
  }

  static save(state, { todo: todoToSave, text }) {
    const todos = state.todos.map(todo => {
      return todo !== todoToSave ? todo : Object.assign({}, todo, { title: text });
    });

    return { ...state, todos };
  }

  static clearCompleted(state) {
    const todos = state.todos.filter(todo => !todo.completed);

    return { ...state, todos };
  }
}

// PUBLIC API

export default Reducer;

export function reducer(state, { type, ...args }) {
  return Reducer[type].call({}, state, args);
}
