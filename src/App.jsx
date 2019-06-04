import React from 'react';
import { useRoute } from 'react-router5';
import PropTypes from 'prop-types';

import { pathNames } from '@todomvc/router';

import Todos from '@todomvc/components/pages/Todos';
import TodosViewModel from '@todomvc/view_models/TodoViewModel';

// COMPONENTS

/**
 * The top level application instance.
 *
 * @param {Object} props - the component props
 * @param {ApolloClient} props.apolloClient - the graphql client
 */
function App({ apolloClient }) {
  const { route } = useRoute();

  const topLevelRoute = route.name.split('.')[0];

  switch (topLevelRoute) {
    case pathNames.TODOS:
      return (
        <TodosViewModel initialState={{ todos: [] }} apolloClient={apolloClient}>
          <Todos />
        </TodosViewModel>
      );
    default:
      return null;
  }
}

App.propTypes = {
  apolloClient: PropTypes.any,
};

// PUBLIC API

export default App;
