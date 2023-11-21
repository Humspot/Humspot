import { UseIonRouterResult } from "@ionic/react";
import { App as CapacitorApp } from '@capacitor/app';

export const navigateBack = (router: UseIonRouterResult, exitApp: boolean = true) => {
  if (!exitApp) {
    router.goBack();
  } else {
    CapacitorApp.exitApp();
  }
}