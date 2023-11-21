import { RouterDirection, UseIonRouterResult } from "@ionic/react";

export const dynamicNavigate = (router: UseIonRouterResult, path: string, direction: RouterDirection): boolean => {
  const action = direction === "forward" ? "push" : "pop";
  router.push(path, direction, action);
  return true;
}