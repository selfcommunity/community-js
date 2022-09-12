/**
 * Display notification
 * @param notification
 * @return {Promise<void>}
 */
function displayNotification(notification) {
  console.log(`[Service Worker] Show notification`);
  return self.registration.showNotification(
    notification.title,
    notification.options,
  );
}

/**
 * Extract notification data
 * @param event
 * @return {{options: ({title}|*), title: *}}
 */
function getNotificationData(event) {
  let title;
  let options;
  try {
    options = JSON.parse(event.data.text());
    title = options.title ? options.title : '';
  } catch (e) {
    title = event.data.text();
  }
  return { title, options };
}

/**
 * Return the url associated to the notification payload
 * @param notification
 */
function getNotificationLocation(notification) {
  if (
    notification.options &&
    notification.options.data &&
    notification.options.data.url
  ) {
    try {
      return new URL(notification.options.data.url).origin;
    } catch (e) {
      console.log(`[Service Worker] Invalid notification url: "${notification.options.data.url}"`);
      return origin;
    }
  } else {
    return origin;
  }
}

/**
 * This looks to see if a current tab is already open and focused with origin
 * @param url
 */
function isOriginFocused(url) {
  return clients
    .matchAll({
      type: 'window',
    })
    .then(function (clientList) {
      let isFocused = false;
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        const clientOrigin = new URL(client.url).origin;
        isFocused = isFocused || (clientOrigin === url && 'focus' in client);
      }
      return Promise.resolve(isFocused);
    })
    .catch((e) => {
      console.log(`[Service Worker] Error: "${e}"`);
      return Promise.reject();
    });
}

/**
 * Handle push event. The browser receives the push message, figures out
 * what service worker the push is for, wakes up that service worker,
 * and dispatches a push event.
 * !IMPORTANT: if a tab was found with the focus on the origin -> notification will not be displayed.
 */
self.addEventListener('push', function (event) {
  console.log(`[Service Worker] Push received: "${event.data.text()}"`);
  const notification = getNotificationData(event);
  const notify = async () => {
    const isFocused = await isOriginFocused(
      getNotificationLocation(notification),
    );
    console.log(`[Service Worker] Tab with origin is focused? "${isFocused}"`);
    return isFocused ? Promise.resolve() : displayNotification(notification);
  };
  event.waitUntil(notify());
});

/**
 * Handle click on notification
 * @param event
 */
function handleNotificationClick(event) {
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    event.waitUntil(clients.openWindow(origin));
  }
}

/**
 * Handle notification clicks by listening for
 * notificationclick events in your service worker.
 */
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.');
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();
  handleNotificationClick(event);
});

/**
 * Handle event 'pushsubscriptionchange'
 */
self.addEventListener('pushsubscriptionchange', function (event) {
  console.log(`[Service Worker] Pushsubscriptionchange event: "${event}"`);
});
