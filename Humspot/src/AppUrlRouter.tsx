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

// The issue you're facing is related to the asynchronous nature of the AWS Amplify authentication flow. 
// Waiting 5 seconds might not be the optimal solution, but it ensures you're giving the process enough time to complete before attempting to access user information. 
// Here are some alternative approaches you can consider:

// 1. Utilize Promises or Async/Await:
// Instead of a timeout, rewrite the logic using promises or async/await to wait for the authentication process to finish before reloading the page. You can achieve this by:
// Calling Auth.currentAuthenticatedUser() after _handleAuthResponse to check if the user is successfully authenticated.
// Only reload the page if the user is authenticated.
// Example:

// const checkRoute = useCallback(async () => {
//   // ... existing code
//   if (event.url.includes('/redirect-sign-in')) {
//     await present({ message: "Logging in ..." });
//     try {
//       await (Auth as any)._handleAuthResponse(event.url);
//       const currentUser = await Auth.currentAuthenticatedUser();
//       if (currentUser) {
//         window.location.reload();
//       } else {
//         console.error("Authentication failed!");
//       }
//     } catch (error) {
//       console.error("Error during authentication:", error);
//     } finally {
//       await dismiss();
//     }
//     return;
//   }
// });

// Use code with caution.
// 2. Leverage Auth.currentSession:
// AWS Amplify provides the Auth.currentSession method to retrieve information about the current user session. You can use this to check if the user is authenticated before reloading the page.

// Example:
// const checkRoute = useCallback(() => {
//   // ... existing code
//   if (event.url.includes('/redirect-sign-in')) {
//     await present({ message: "Logging in ..." });
//     try {
//       await (Auth as any)._handleAuthResponse(event.url);
//       const currentSession = await Auth.currentSession();
//       if (currentSession) {
//         window.location.reload();
//       } else {
//         console.error("User not authenticated!");
//       }
//     } catch (error) {
//       console.error("Error during authentication:", error);
//     } finally {
//       await dismiss();
//     }
//     return;
//   }
// });
// Use code with caution.

// 3. Implement Event Listeners:
// Instead of relying on the initial navigation, you can implement event listeners that trigger specific actions upon successful authentication. 
// This approach avoids unnecessary page reloads and provides a more responsive user experience.
// Example:

// Listen to the Auth.onAuthStateChange event.
// When the user signs in successfully, reload the page or navigate to the desired route.