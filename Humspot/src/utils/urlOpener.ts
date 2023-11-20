import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

export const urlOpener = async (url: string): Promise<void> => {
  console.log("urlOpener");
  await Browser.open({ url: url, windowName: Capacitor.isNativePlatform() ? '_blank' : '_self' })
}