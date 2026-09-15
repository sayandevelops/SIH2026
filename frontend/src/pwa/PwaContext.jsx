import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const PwaContext = createContext(null);

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return localStorage.getItem("shieldscan_pwa_dismissed") === "true";
  });

  // Detect standalone mode
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      setIsInstalled(isStandalone);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handler = (e) => setIsInstalled(e.matches);
    try {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } catch {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      // Prevent browser's default prompt
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("[PWA] 'beforeinstallprompt' captured. Ready for custom install.");
    };

    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed.");
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success("ShieldScan installed successfully! Launch it anytime from your desktop or app drawer.", {
        duration: 5000,
        icon: "🛡️",
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Network connection restored. Back online.", {
        id: "network-status",
        icon: "🌐",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Network disconnected. Offline inspection cache active.", {
        id: "network-status",
        icon: "⚡",
        duration: 6000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Install trigger method
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      // Fallback instructions if browser already installed or doesn't support automatic prompt
      if (isInstalled) {
        toast("ShieldScan is already running as an installed application.", { icon: "✅" });
      } else {
        toast("To install ShieldScan, click the install icon (⊕) in your browser address bar or menu.", {
          icon: "ℹ️",
          duration: 6000,
        });
      }
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] User accepted the install prompt.");
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      } else {
        console.log("[PWA] User dismissed the install prompt.");
      }
    } catch (err) {
      console.error("[PWA] Error calling prompt():", err);
    }
  }, [deferredPrompt, isInstalled]);

  // Update app / reload service worker
  const updateApp = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  }, [swRegistration]);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    localStorage.setItem("shieldscan_pwa_dismissed", "true");
  }, []);

  return (
    <PwaContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOffline,
        needRefresh,
        setNeedRefresh,
        swRegistration,
        setSwRegistration,
        bannerDismissed,
        promptInstall,
        updateApp,
        dismissBanner,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePWA must be used within a PwaProvider");
  }
  return context;
}
