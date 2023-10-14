import React from "react";
import { HumspotUser } from "./types";

type Props = {
  children: React.ReactNode;
}

export const guestUser: HumspotUser = { awsUsername: null, email: null, accountType: 'guest', imageUrl: '', accountStatus: 'restricted', authProvider: 'custom', dateCreated: ''};

export type ContextType = {
  humspotUser: HumspotUser;
  setHumspotUser: React.Dispatch<React.SetStateAction<HumspotUser>>;
}

export const Context = React.createContext<ContextType | null>(null);
export const ContextProvider = ({ children }: Props) => {

  const [humspotUser, setHumspotUser] = React.useState<HumspotUser>(guestUser);

  const memoizedContextValue = React.useMemo(() => ({
    humspotUser, setHumspotUser
  }), [humspotUser, setHumspotUser]);

  return (
    <Context.Provider value={memoizedContextValue}> {children} </Context.Provider>
  )
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}