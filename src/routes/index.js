const pathNames = {
  TODOS: 'todos',
  TODOS_ACTIVE: 'todos.active',
  TODOS_COMPLETED: 'todos.completed',
};

export default [
  { name: pathNames.TODOS, path: '/' },
  { name: pathNames.TODOS_ACTIVE, path: '/active' },
  { name: pathNames.TODOS_COMPLETED, path: '/completed' },
];

export { pathNames };
