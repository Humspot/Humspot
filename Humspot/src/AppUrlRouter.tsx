/**
 * @file AppUrlRouter.tsx
 * @fileoverview handles deep links which allows users to open the app using a URL
 */

import { useCallback, useEffect } from "react"
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useIonRouter } from "@ionic/react";
import { Auth } from "aws-amplify";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { timeout } from "./utils/functions/timeout";


const AppUrlRouter = () => {

  const router = useIonRouter();

  const checkRoute = useCallback(() => {
    App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      const domain: string = 'humspotapp.com'
      const slug: string[] = event.url.split(domain);
      const path: string | undefined = slug.pop();
      console.log({ event });
      if (event.url.includes('/redirect-sign-in')) {
        console.log("1");
        (Auth as any)._handleAuthResponse(event.url);
        await timeout(5000);
        window.location.reload();
        console.log("2");
      } else {
        console.log("ELSE....");
        if (path) {
          const decodedPath: string = decodeURIComponent(path);
          if (router.routeInfo.pathname !== decodedPath) {
            router.push(decodedPath);
          } else {
            console.log("Already on the same page, no need to push to router.");
          }
        } else {
          console.error("Path is not valid");
        }
      }
    });
  }, []);

  useEffect(() => {
    checkRoute();
  }, [])

  return null;
};

export default AppUrlRouter;