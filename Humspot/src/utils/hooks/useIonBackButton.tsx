/**
 * @file useIonBackButton.tsx
 * @fileoverview hook used to handle hardware back button presses
 */
import { useEffect, RefObject } from 'react';

// Define a type for the callback function
type BackButtonAction = () => void | Promise<void>;

// Define the custom hook
const useIonBackButton = (priority: number, action: BackButtonAction, deps: any[]) => {
  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(priority, async () => {
        await action();
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [action, ...deps]); // Dependencies include the action and any external ref or state
};

export default useIonBackButton;