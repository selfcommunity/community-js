const withServiceWorker = (Story, context) => {
  /**
   * Register a service worker
   */
  if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((r) => console.log('Service worker registered!'))
      .catch((e) => console.log(e));
  }

  return <Story {...context} />;
};

export default  withServiceWorker;