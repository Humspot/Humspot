/**
 * @file useContext.txt 
 * @fileoverview contains the global variables and setters used throughout the application.
 */

import React from "react";
import { HumspotUser } from "../types";

type Props = {
  children: React.ReactNode;
};

export type ContextType = {
  humspotUser: HumspotUser | null | undefined; // null if loading, undefined if not logged in
  setHumspotUser: React.Dispatch<React.SetStateAction<HumspotUser | null | undefined>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  showTabs: boolean;
  setShowTabs: React.Dispatch<React.SetStateAction<boolean>>;
  recentlyViewedUpdated: boolean;
  setRecentlyViewedUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<any>>;
};

export const Context = React.createContext<ContextType | null>(null);
export const ContextProvider = ({ children }: Props) => {
  const [humspotUser, setHumspotUser] = React.useState<HumspotUser | null | undefined>(null);
  const [darkMode, setDarkMode] = React.useState<boolean>(true);
  const [showTabs, setShowTabs] = React.useState<boolean>(true);
  const [recentlyViewedUpdated, setRecentlyViewedUpdated] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<any>(null);

  const memoizedContextValue = React.useMemo(
    () => ({
      humspotUser,
      setHumspotUser,
      darkMode,
      setDarkMode,
      showTabs,
      setShowTabs,
      recentlyViewedUpdated,
      setRecentlyViewedUpdated,
      currentPage,
      setCurrentPage
    }),
    [humspotUser, setHumspotUser, darkMode, setDarkMode, showTabs, setShowTabs, recentlyViewedUpdated, setRecentlyViewedUpdated, currentPage, setCurrentPage]
  );

  return (
    <Context.Provider value={memoizedContextValue}>
      {" "}
      {children}{" "}
    </Context.Provider>
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
