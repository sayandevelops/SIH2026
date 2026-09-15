/**
 * Service Worker Registration and Lifecycle Manager
 */

export function registerServiceWorker({ onUpdate, onSuccess } = {}) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("[PWA] Service workers are not supported in this browser.");
    return null;
  }

  // Register on window load to avoid blocking initial rendering performance
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("[PWA] Service Worker registered with scope:", registration.scope);

      // Check if already waiting
      if (registration.waiting) {
        if (onUpdate) onUpdate(registration);
      }

      // Check for updates periodically (e.g. every hour)
      setInterval(() => {
        registration.update().catch((err) => console.debug("[PWA] Update check err:", err));
      }, 60 * 60 * 1000);

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New content is available; please refresh.
              console.log("[PWA] New content is available, update ready.");
              if (onUpdate) onUpdate(registration);
            } else {
              // Content is cached for offline use.
              console.log("[PWA] Content is cached for offline use.");
              if (onSuccess) onSuccess(registration);
            }
          }
        });
      });
    } catch (error) {
      console.error("[PWA] Service worker registration failed:", error);
    }
  });

  // Ensure refresh on controller change
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
