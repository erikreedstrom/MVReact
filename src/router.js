import router5 from 'router5';
import browserPlugin from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';

import routes, { pathNames } from './routes';

export function configureRouter(dependencies = {}) {
  const router = router5(routes, { trailingSlashMode: 'default' }, dependencies);

  // Plugins
  router.usePlugin(
    browserPlugin({
      useHash: false,
      base: window.location.origin,
    }),
  );

  router.start(err => {
    if (err && err.code === 'ROUTE_NOT_FOUND') {
      const { path } = err;
      // Bail if in Storybook
      if (path.match(/\/iframe.html/)) return;

      return router.navigate(pathNames.TODOS, {}, { replace: true });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    router.usePlugin(loggerPlugin);
  }

  return router;
}

export { pathNames };
