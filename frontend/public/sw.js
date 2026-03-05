self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Siete Sopas';
  
  const options = {
    body: data.body || 'Tienes una nueva notificación.',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Abrir o enfocar la pestaña existente si el url coincide
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // Buscar si ya hay una pestaña abierta con esa URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Si encontramos una pestaña, enfocarla
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
