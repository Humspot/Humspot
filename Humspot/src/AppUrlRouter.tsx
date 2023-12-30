/**
 * @file AppUrlRouter.tsx
 * @fileoverview handles deep links which allows users to open the app using a URL
 */

import { useCallback, useEffect } from "react"
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useHistory } from "react-router";
import { useIonRouter } from "@ionic/react";


const AppUrlRouter = () => {

  const router = useIonRouter();

  const checkRoute = useCallback(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
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
        console.error("Path is not valid");
      }
    });
  }, []);

  useEffect(() => {
    checkRoute();
  }, [])

  return null;
};

export default AppUrlRouter;