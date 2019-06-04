import React from 'react';
import ReactDOM from 'react-dom';

import { RouterProvider } from 'react-router5';

import { api } from '@todomvc/services/todo';

import { configureRouter } from '@todomvc/router';

import App from '@todomvc/App';

import('todomvc-common/base.css');
import('todomvc-app-css/index.css');

const router = configureRouter();
router.start();

/**
 * Provides the top level element and binding for the React view tree.
 *
 * This component defines both the router and the graphql client to be
 * used, and instantiates the application.
 */
function Index() {
  return (
    <RouterProvider router={router}>
      <App apolloClient={api.client} />
    </RouterProvider>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
