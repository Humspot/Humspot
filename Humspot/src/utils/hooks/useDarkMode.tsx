/**
 * @file useDarkMode.tsx
 * @fileoverview hook for handling changes between light and dark mode throughout the application.
 */

import { useCallback, useEffect } from "react";

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
      await StatusBar.setStyle({ style: Style.Light });
      await Keyboard.setStyle(keyStyleOptionsLight);
      // if (Capacitor.getPlatform() === 'ios') {}
    } else if (!isChecked || !isChecked.value || isChecked.value === 'true') {
      document.body.classList.toggle("dark");
      context.setDarkMode(true);
      await StatusBar.setStyle({ style: Style.Dark });
      await Keyboard.setStyle(keyStyleOptionsDark);
      // if (Capacitor.getPlatform() === 'ios') {}
    }
  }, []);

  useEffect(() => {
    handleDarkMode();
  }, [handleDarkMode]);
};

export default useDarkMode;