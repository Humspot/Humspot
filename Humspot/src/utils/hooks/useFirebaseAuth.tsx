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

  const getUser = async (uid: string, phoneNumber: string | null): Promise<void> => {
    try {
      if (!uid || !phoneNumber) throw new Error('No phone number provided');
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newHumspotUser: NewHumspotUser | null = await createOrGetFirestoreUser(uid, phoneNumber);
        if (newHumspotUser) {
          context.setNewHumspotUser(newHumspotUser);
          window.location.href = "/";
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Not signed in:", error);
      context.setHumspotUser(undefined);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        console.log("User signed in!");
        getUser(user.uid, user.phoneNumber);
      } else {
        console.log("User signed out!");
        context.setNewHumspotUser(undefined);
        window.location.href = "/";
        window.location.reload();
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
};

export default useFirebaseAuth;
