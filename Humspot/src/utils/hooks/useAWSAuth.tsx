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
      const email: string | null =
        currentUser?.signInUserSession?.idToken?.payload?.email ?? null;
      const awsUsername: string | null = currentUser?.username ?? null;
      console.log(currentUser);
      handleUserLogin(
        email,
        awsUsername,
        "identities" in currentUser?.attributes
      )
        .then((res: LoginResponse) => {
          console.log(res);
          if (!res.user) throw new Error(res.message);
          context.setHumspotUser(res.user);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(undefined);
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          getUser();
          break;
        case "signOut":
          console.log("signed out!");
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