/**
 * @file useFirebaseAuth.tsx
 * @fileoverview hook to handle Firebase auth (login, logout).
 */

import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ContextType } from "./useContext";
import { NewHumspotUser } from "../types";
import auth, { createOrGetFirestoreUser } from "../server";

const useFirebaseAuth = (context: ContextType) => {

  const getUser = async (): Promise<void> => {
    if (auth && auth.currentUser) {
      try {
        const uid: string = auth.currentUser.uid;
        const phoneNumber: string | null = auth.currentUser.phoneNumber;
        if (!uid || !phoneNumber) throw new Error('No phone number provided');
        const newHumspotUser: NewHumspotUser | null = await createOrGetFirestoreUser(uid, phoneNumber);
        if (newHumspotUser) {
          context.setNewHumspotUser(newHumspotUser);
        }
      } catch (error) {
        console.error("Not signed in:", error);
        context.setNewHumspotUser(undefined);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      console.log(auth);
      console.log(user);
      if (user) {
        console.log("User signed in!");
        getUser();
      } else {
        console.log("User signed out!");
        context.setNewHumspotUser(undefined);
      }
    });

    getUser();

    return () => unsubscribe();
  }, []);

  return null;
};

export default useFirebaseAuth;
