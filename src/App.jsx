import React from 'react';
import { useRoute } from 'react-router5';

import { pathNames } from '@todomvc/router';

import Todos from '@todomvc/components/pages/Todos';
import TodosViewModel from '@todomvc/view_models/TodoViewModel';

// COMPONENTS

function App() {
  const { route } = useRoute();

  const topLevelRoute = route.name.split('.')[0];

  switch (topLevelRoute) {
    case pathNames.TODOS:
      return (
        <TodosViewModel initialState={{ todos: [] }}>
          <Todos />
        </TodosViewModel>
      );
    default:
      return null;
  }
}

// PUBLIC API

export default App;
