/**
 * @file useDarkMode.tsx
 * @fileoverview hook for handling changes between light and dark mode throughout the application.
 */

import { useCallback, useEffect } from "react";

import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from "@capacitor/keyboard";
import { Preferences } from "@capacitor/preferences";
import { StatusBar, Style } from "@capacitor/status-bar";

import { ContextType } from "./useContext";


const keyStyleOptionsLight: KeyboardStyleOptions = {
  style: KeyboardStyle.Light
};
const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
};

const useDarkMode = (context: ContextType) => {
  const handleDarkMode = useCallback(async () => {
    const isChecked = await Preferences.get({ key: "darkMode" });
    if (isChecked.value === "false") {
      context.setDarkMode(false);
      if (Capacitor.getPlatform() === 'ios') {
        Keyboard.setStyle(keyStyleOptionsLight);
        StatusBar.setStyle({ style: Style.Light });
      }
    } else if (!isChecked || !isChecked.value || isChecked.value === 'true') {
      document.body.classList.toggle("dark");
      context.setDarkMode(true);
      if (Capacitor.getPlatform() === 'ios') {
        Keyboard.setStyle(keyStyleOptionsDark);
        StatusBar.setStyle({ style: Style.Dark });
      }
    }
  }, []);

  useEffect(() => {
    handleDarkMode();
  }, [handleDarkMode]);
};

export default useDarkMode;