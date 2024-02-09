/**
 * @file AppUrlRouter.tsx
 * @fileoverview handles "deep links" which allows users to open the app using a URL on native devices
 */

import { useCallback, useEffect } from "react"
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useIonLoading, useIonRouter } from "@ionic/react";

import { Auth } from "aws-amplify";
import { timeout } from "./utils/functions/timeout";

const AppUrlRouter = (): null => {

  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  const checkRoute = useCallback(() => {
    App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      if (event.url.includes('/redirect-sign-in')) { // if user has just signed in using Google
        await present({ message: "Logging in ..." });
        (Auth as any)._handleAuthResponse(event.url)
        await timeout(5000); // hacky workaround to ensure user is logged in. Look into...
        window.location.reload();
        await dismiss();
        return;
      }

      const domain: string = 'humspotapp.com'
      const slug: string[] = event.url.split(domain);
      const path: string | undefined = slug.pop();
      if (path) {
        const decodedPath: string = decodeURIComponent(path);
        if (router.routeInfo.pathname !== decodedPath) {
          router.push(decodedPath);
        } else {
          console.log("Already on the same page, no need to push to router.");
        }
      } else {
        console.error("Path is not valid!");
      }
    });
  }, []);

  useEffect(() => {
    checkRoute();
  }, [])

  return null;
};

export default AppUrlRouter;