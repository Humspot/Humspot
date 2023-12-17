/**
 * @file dynamicNavigate.tsx
 * @fileoverview Interface for routing between pages; prevents users from going back to the previous page if needed (for example, after logging in).
 */

import { RouterDirection, UseIonRouterResult } from "@ionic/react";

export const dynamicNavigate = (router: UseIonRouterResult, path: string, direction: RouterDirection): boolean => {
  const action = direction === "forward" ? "push" : "pop";
  router.push(path, direction, action);
  return true;
}