/**
 * When you trigger a push message, the browser receives the push message,
 * figures out what service worker the push is for, wakes up that service worker,
 * and dispatches a push event. You need to listen for this event and show a notification as a result.
 */
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Handle notification clicks by listening for notificationclick events in your service worker.
 */
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.');
  event.notification.close();
  event.waitUntil(clients.openWindow(origin));
});
