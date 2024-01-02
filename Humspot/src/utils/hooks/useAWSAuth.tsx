/**
 * @file useAWSAuth.tsx
 * @fileoverview hook to handle AWS auth (login, logout).
 */

import { Auth, Hub } from "aws-amplify";
import { useEffect } from "react";
import { ContextType } from "./useContext";
import { handleUserLogin } from "../server";
import { LoginResponse } from "../types";


const useAWSAuth = (context: ContextType) => {

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      if (currentUser) {
        const email: string | null =
          currentUser?.signInUserSession?.idToken?.payload?.email ?? null;
        const awsUsername: string | null = currentUser?.username ?? null;
        handleUserLogin(
          email,
          awsUsername,
          ("attributes" in currentUser && "identities" in currentUser) || ("idToken" in currentUser && "payload" in currentUser.idToken && "identities" in currentUser.idToken.payload)
        )
          .then((res: LoginResponse) => {
            console.log(res);
            if (!res.user) throw new Error(res.message);
            context.setHumspotUser(res.user);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(undefined);
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log("SIGN IN!");
          getUser();
          break;
        case "signOut":
          console.log("SIGNED OUT!");
          context.setHumspotUser(null);
          window.location.href = "/";
          window.location.reload();
          break;
        case "customOAuthState":
          console.log("customOAuthState");
      }
    });

    getUser();

    return unsubscribe;
  }, []);

};

export default useAWSAuth;

// aws cognito-idp describe-user-pool --user-pool-id <your-user-pool-id>
