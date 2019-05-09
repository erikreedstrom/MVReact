import React from 'react';
import ReactDOM from 'react-dom';

import { RouterProvider } from 'react-router5';

import { configureRouter } from '@todomvc/router';

import App from '@todomvc/App';

import('todomvc-common/base.css');
import('todomvc-app-css/index.css');

const router = configureRouter();
router.start();

function Index() {
  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
