export * from './classes';

if (process.env.NODE_ENV === 'development') {
  import('./components/app-render');
}
