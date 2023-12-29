/**
 * @file AppUrlRouter.tsx
 * @fileoverview handles deep links which allows users to open the app using a URL
 */

import { useCallback, useEffect } from "react"
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useHistory } from "react-router";


const AppUrlRouter = () => {

  const history = useHistory();

  const checkRoute = useCallback(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const domain: string = 'humspotapp.com'
      const slug: string[] = event.url.split(domain);
      const path: string | undefined = slug.pop();
      if (path) {
        const decodedPath: string = decodeURIComponent(path);
        history.push(decodedPath);
      }
    });
  }, []);

  useEffect(() => {
    checkRoute();
  }, [])

  return null;
};

export default AppUrlRouter;