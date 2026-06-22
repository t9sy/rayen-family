self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Page deployed";
  const options = {
    body: data.body || "A subscribed page was deployed.",
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || data.pageId || "page-deployed",
    data: data.data || { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
