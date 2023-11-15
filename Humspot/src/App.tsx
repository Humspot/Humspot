/**
 * @file App.tsx
 * @fileoverview Define routes and main application components here.
 */

import { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  calendar,
  compass,
  map,
  person,
} from "ionicons/icons";


import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

import ExplorePage from "./pages/explore";
import CalendarPage from "./pages/calendar";
import MapPage from "./pages/Map";
import ProfilePage from "./pages/Profile";
import TestGoogleAuth from "./pages/TestGoogleAuth";

import ActivityPage from "./pages/ActivityPage";
import SubmitEventPage from "./pages/SubmitEvent";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";

import { Auth, Hub } from "aws-amplify";
import { ToastProvider } from "@agney/ir-toast";

import { useContext } from "./utils/my-context";
import { handleUserLogin } from "./utils/server";
import { LoginResponse } from "./utils/types";


setupIonicReact({ mode: "ios" });



const App: React.FC = () => {

  const context = useContext();
  const tabBarStyle = context.showTabs;

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          getUser();
          break;
        case "signOut":
          console.log("signed out!");
          context.setHumspotUser(null);
          window.location.href = "/";
          window.location.reload();
          break;
        case "customOAuthState":
          console.log("customOAuthState");
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const email: string | null =
        currentUser?.signInUserSession?.idToken?.payload?.email ?? null;
      const awsUsername: string | null = currentUser?.username ?? null;
      console.log(currentUser);
      handleUserLogin(email, awsUsername, "identities" in currentUser?.attributes)
        .then((res: LoginResponse) => {
          console.log(res.message);
          if (!res.user) throw new Error(res.message);
          context.setHumspotUser(res.user);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(undefined);
    }
  };

  const [currentTab, setCurrentTab] = useState("tab1");

  function handleTabChange(event: CustomEvent<{ tab: string }>): void {
    setCurrentTab(event.detail.tab);
  }

  return (
    <IonApp>

      <ToastProvider>

        <IonReactRouter>
          <IonTabs>

            <IonRouterOutlet>
              <Route exact path="/" render={() => <Redirect to="/explore" />} />
              <Route exact path="/explore" component={ExplorePage} />
              <Route exact path="/calendar" component={CalendarPage} />
              <Route exact path="/map" component={MapPage} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/sign-up" component={SignUp} />
              <Route exact path="/sign-in" component={SignIn} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/verify-email/:email/:toVerify" component={VerifyEmail} />
              <Route exact path="/google-auth" component={TestGoogleAuth} />
              <Route exact path="/submit-event" component={SubmitEventPage} />
              <Route exact path="/activity/:id" component={ActivityPage} />
            </IonRouterOutlet>

            <IonTabBar
              slot="bottom"
              color="primary"
              onIonTabsWillChange={handleTabChange}
              style={tabBarStyle ? {} : { display: "none" }}
            >
              <IonTabButton tab="tab1" href="/explore">
                <IonIcon
                  aria-hidden="true"
                  icon={compass}
                  color={currentTab == "tab1" ? "icon-highlight" : "icon-dark"}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab2" href="/map">
                <IonIcon
                  aria-hidden="true"
                  icon={map}
                  color={currentTab == "tab2" ? "icon-highlight" : "icon-dark"}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab3" href="/calendar">
                <IonIcon
                  aria-hidden="true"
                  icon={calendar}
                  color={currentTab == "tab3" ? "icon-highlight" : "icon-dark"}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab4" href="/profile">
                <IonIcon
                  aria-hidden="true"
                  icon={person}
                  color={currentTab == "tab4" ? "icon-highlight" : "icon-dark"}
                  size="large"
                />
              </IonTabButton>
            </IonTabBar>

          </IonTabs>
        </IonReactRouter>

      </ToastProvider>

    </IonApp>
  );
};

export default App;
