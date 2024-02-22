/**
 * @file useDarkMode.tsx
 * @fileoverview hook for handling changes between light and dark mode throughout the application.
 */

import { useCallback, useEffect } from 'react';

import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';

import { ContextType } from './useContext';


const useDarkMode = (context: ContextType) => {

  const handleDarkMode = useCallback(async () => {
    const isChecked = await Preferences.get({ key: 'darkMode' });
    if (isChecked.value === 'false') {
      context.setDarkMode(false);
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f5fff7' });
      await NavigationBar.setColor({ color: '#edf2ed' });
    } else if (!isChecked || !isChecked.value || isChecked.value === 'true') {
      document.body.classList.toggle('dark');
      context.setDarkMode(true);
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#121212' });
      await NavigationBar.setColor({ color: '#1f1f1f' });
    }
  }, []);

  useEffect(() => {
    handleDarkMode();
  }, [handleDarkMode]);
};

export default useDarkMode;