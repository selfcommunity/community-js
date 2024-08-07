const withServiceWorker = (Story, context) => {
  /**
   * Register a service worker
   */
	// @ts-ignore
	if (navigator && navigator.serviceWorker) {
    // @ts-ignore
		navigator.serviceWorker
      .register('service-worker.js')
      .then((r) => console.log('Service worker registered!'))
      .catch((e) => console.log(e));
  }

  return <Story {...context} />;
};

export default  withServiceWorker;
