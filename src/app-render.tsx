import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const AppLazy = React.lazy(() => import('./app'));
ReactDOM.render(
  <Suspense fallback={<span>Loading...</span>}>
    <AppLazy />
  </Suspense>,
  document.getElementById('root')
);
