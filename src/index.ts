export * from './classes';

if (process.env.NODE_ENV === 'development') {
  void import('./components/app-render');
}
