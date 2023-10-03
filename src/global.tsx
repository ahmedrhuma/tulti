import {AppstoreAddOutlined } from '@ant-design/icons';
import { Workbox } from 'workbox-window';
import { Modal, message, notification } from 'antd';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch(() => {});
  }
};

// if pwa is true
if (true) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning('أنت حاليا أوفلاين!');
  });
} 
if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  // if (serviceWorker.getRegistrations) {
  //   serviceWorker.getRegistrations().then((sws) => {
  //     sws.forEach((sw) => {
  //       sw.unregister();
  //     });
  //   });
  // }
  // serviceWorker.getRegistration().then((sw) => {
  //   if (sw) sw.unregister();
  // });

  window.addEventListener("load", async () => {
    const wb = new Workbox('/sw.js');
    wb.register().then((register: any) => {
      register.addEventListener('updatefound', (event: Event) => {
        const e = event as CustomEvent;
        const reloadSW = async () => {
          // Check if there is sw whose state is waiting in ServiceWorkerRegistration
          // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
          const worker = e.detail && e.detail.waiting;
          if (!worker) {
            return true;
          }

          notification.success({
            message: 'تم تحديث التطبيق!',
            description: 'التطبيق تحدث بسخة جديدة وكل التغييرات توا تخدم وأمورها طيبة',
            direction: "rtl"
          })
          // Send skip-waiting event to waiting SW with MessageChannel
          await new Promise((resolve, reject) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (msgEvent) => {
              if (msgEvent.data.error) {
                reject(msgEvent.data.error);
              } else {
                resolve(msgEvent.data);
              }
            };
            worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
          });
    
          clearCache();
          window.location.reload();
          return true;
        };
        reloadSW();
      });
    })
  });

  let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  if(window.localStorage) {
    if(window.localStorage.getItem('ahmedrhuma-install-asked')) return;
    else window.localStorage.setItem('ahmedrhuma-install-asked', true);
  }
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  e.preventDefault();
  // Save the event because you'll need to trigger it later.
  deferredPrompt = e;
  // Show your customized install prompt for your PWA
  // Your own UI doesn't have to be a single element, you
  // can have buttons in different locations, or wait to prompt
  // as part of a critical journey.
  Modal.confirm({
    title: 'شن رأيك تنزل النظام كتطبيق؟',
    direction: "rtl",
    okText: "نزلني كتطبيق",
    icon: <AppstoreAddOutlined />,
    cancelText: "لا مرتاح هكي",
    maskClosable: true,
    closable: true,
    content: "تقدر تنزل النظام كتطبيق وتستخدمه كأن نازل من الستور وتستقبل إشعارات والامور طيبة، شني مني؟",
    onOk() {
      // deferredPrompt is a global variable we've been using in the sample to capture the `beforeinstallevent`
      deferredPrompt.prompt();
      // Find out whether the user confirmed the installation or not
      deferredPrompt.userChoice.then(({ outcome }) => {
        // The deferredPrompt can only be used once.
        deferredPrompt = null;
        // Act on the user's choice
        if (outcome === 'accepted') {
          Modal.destroyAll();
        } else if (outcome === 'dismissed') {
          Modal.destroyAll();
        }
      })
    },
  });
});
}

const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    message.startsWith('[React Intl] Missing message:')
  ) {
    return;
  }
  consoleError(message, ...args);
};