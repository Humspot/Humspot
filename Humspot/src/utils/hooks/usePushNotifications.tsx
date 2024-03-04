/**
 * @file usePushNotifications.tsx
 * @fileoverview hook to handle push notifications within native application.
 */

import { useCallback, useEffect } from 'react';
import { ActionPerformed, PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { FCM } from '@capacitor-community/fcm';
import { Preferences } from '@capacitor/preferences';
import { useIonRouter } from '@ionic/react';


const usePushNotifications = () => {

  const router = useIonRouter();

  // Function to handle push notification action
  const handlePushNotificationActionPerformed = useCallback((notification: ActionPerformed) => {
    alert('clicked on notif!' + notification);
    console.log({ notification });

    let urlJSON: string = notification.notification.data["gcm.notification.data"] as string;
    let noBackSlashes: string = urlJSON.toString().replaceAll('\\', '');
    let removedUrl: string = noBackSlashes.substring(7, noBackSlashes.length);
    let finalUrl: string = removedUrl.slice(1, removedUrl.length - 2);

    console.log(finalUrl);
    router.push(finalUrl);
  }, []);

  // Function to register push notifications
  const registerPushNotifications = useCallback(async () => {
    let permStatus = await PushNotifications.checkPermissions();
    console.log({ permStatus });
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      } else {
        await PushNotifications.register();
        const token = await FCM.getToken();
        await Preferences.set({ key: "notificationsToken", value: token.token });
        console.log({ token });
      }
    } else {
      const x = await Preferences.get({ key: "notificationsToken" });
      console.log("NOTIFICATIONS TOKEN: " + x.value);
    }
  }, []);

  // Setting up the listeners and registering for notifications
  useEffect(() => {
    const pushNotificationListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      handlePushNotificationActionPerformed,
    );

    if (Capacitor.getPlatform() === 'ios') {
      registerPushNotifications();
    }

    return () => {
      pushNotificationListener.remove();
    };
  }, [handlePushNotificationActionPerformed, registerPushNotifications]);
};

export default usePushNotifications;