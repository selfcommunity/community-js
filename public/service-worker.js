/**
 * When you trigger a push message, the browser receives the push message,
 * figures out what service worker the push is for, wakes up that service worker,
 * and dispatches a push event. You need to listen for this event and show a notification as a result.
 */
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  let title = '';
  let options = {};
  try {
    options = JSON.parse(event.data.text());
  } catch (e) {
    title = event.data.text();
  }
  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Handle notification clicks by listening for notificationclick events in your service worker.
 */
self.addEventListener('notificationclick', function (event) {
  // DA VEDERE https://github.com/pirminrehm/service-worker-web-push-example/blob/main/client/service-worker.js

  console.log('[Service Worker] Notification click received.');
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }),
  );
  event.notification.close();
  event.waitUntil(clients.openWindow(origin));
});
