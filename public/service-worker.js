/**
 * Display notification
 * @param event
 * @return {Promise<void>}
 */
function displayNotification(event) {
  let title = '';
  let options = {};
  try {
    options = JSON.parse(event.data.text());
    title = options.title ? options.title : '';
  } catch (e) {
    title = event.data.text();
  }
  self.registration.showNotification(title, options);
  return Promise.resolve();
}

/**
 * When you trigger a push message, the browser receives the push message,
 * figures out what service worker the push is for, wakes up that service worker,
 * and dispatches a push event. You need to listen for this event and show a notification as a result.
 */
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  // This looks to see if a current tab is already open and focused with origin
  /* event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        let isFocused = false;
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          isFocused = isFocused || (client.url === '/' && 'focus' in client);
        }
        if (isFocused && clients.openWindow) {
          event.waitUntil(displayNotification(event));
        }
      }),
  ); */
  event.waitUntil(displayNotification(event));
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
  if (event.action === 'view') {
    handleNotificationClick(event);
  } else {
    handleNotificationClick(event);
  }
  handleNotificationClick(event);
});

/**
 * Handle event 'pushsubscriptionchange'
 */
self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('Pushsubscriptionchange:');
  console.log(event);
});
