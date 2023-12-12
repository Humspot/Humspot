/**
 * @file useTabBarVisibility.tsx
 * @fileoverview hook used for controlling the animation when hiding / showing the bottom tab bar.
 */

import { useState, useEffect } from "react";

import { ContextType } from "./useContext";


const useTabBarVisibility = (context: ContextType) => {
  const [tabBarDisplay, setTabBarDisplay] = useState('flex');
  const [tabBarOpacity, setTabBarOpacity] = useState(1);

  useEffect(() => {
    if (context.showTabs) {
      setTabBarDisplay('flex');
      setTimeout(() => setTabBarOpacity(1), 25);
    } else {
      setTabBarOpacity(0);
      setTimeout(() => setTabBarDisplay('none'), 500);
    }
  }, [context.showTabs]);

  return { tabBarDisplay, tabBarOpacity };
};

export default useTabBarVisibility;