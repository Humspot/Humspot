/**
 * @file App.tsx
 * @fileoverview Define routes and main application components here.
 */

import { useState, useEffect, useCallback } from "react";
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
import { calendar, compass, map, person } from "ionicons/icons";

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

import ExplorePage from "./pages/Explore";
import CalendarPage from "./pages/Calendar";
import MapPage from "./pages/Map";
import ProfilePage from "./pages/Profile";

import ActivityPage from "./pages/ActivityPage";
import SubmitEventPage from "./pages/SubmitEvent";
import SubmitAttractionPage from "./pages/SubmitAttraction";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";

import { Auth, Hub } from "aws-amplify";
import { ToastProvider } from "@agney/ir-toast";

import { useContext } from "./utils/my-context";
import { handleUserLogin } from "./utils/server";
import { LoginResponse } from "./utils/types";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import SubmittedActivities from "./pages/SubmittedActivities";
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Preferences } from "@capacitor/preferences";
import BecomeACoodinator from "./pages/BecomeACoodinator";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApproveActivitySubmission from "./pages/AdminApproveActivitySubmission";

setupIonicReact({ mode: "ios" });

const keyStyleOptionsLight: KeyboardStyleOptions = {
  style: KeyboardStyle.Light
};
const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
};

const App: React.FC = () => {
  const context = useContext();

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
      handleUserLogin(
        email,
        awsUsername,
        "identities" in currentUser?.attributes
      )
        .then((res: LoginResponse) => {
          console.log(res);
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
  };

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

  const [tabBarDisplay, setTabBarDisplay] = useState('flex');
  const [tabBarOpacity, setTabBarOpacity] = useState(1);

  useEffect(() => {
    if (context.showTabs) {
      setTabBarDisplay('flex');
      setTimeout(() => setTabBarOpacity(1), 25); // small delay to allow display change to take effect
    } else {
      setTabBarOpacity(0);
      setTimeout(() => setTabBarDisplay('none'), 500); // match this with your CSS transition duration
    }
  }, [context.showTabs]);



  return (
    <IonApp>
      <ToastProvider>
        <IonReactRouter>
          <IonTabs className={context.showTabs ? 'tab-bar-visible' : 'tab-bar-hidden'}>
            <IonRouterOutlet>
              <Route exact path="/" render={() => <Redirect to="/explore" />} />
              <Route exact path="/explore" component={ExplorePage} />
              <Route exact path="/calendar" component={CalendarPage} />
              <Route exact path="/map" component={MapPage} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/sign-up" component={SignUp} />
              <Route exact path="/sign-in" component={SignIn} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/terms-and-conditions" component={TermsAndConditions} />
              <Route exact path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/become-a-coordinator" component={BecomeACoodinator} />
              <Route exact path="/admin-dashboard" component={AdminDashboard} />
              <Route exact path="/admin-dashboard/submission/:id" component={AdminApproveActivitySubmission} />
              <Route
                exact
                path="/verify-email/:email/:toVerify"
                component={VerifyEmail}
              />
              <Route exact path="/submit-event" component={SubmitEventPage} />
              <Route exact path="/submit-attraction" component={SubmitAttractionPage} />
              <Route exact path="/submitted-activities" component={SubmittedActivities} />
              <Route exact path="/activity/:id" component={ActivityPage} />
            </IonRouterOutlet>

            <IonTabBar
              id='main-tab-bar'
              slot="bottom"
              onIonTabsWillChange={handleTabChange}
              style={{ display: tabBarDisplay, opacity: tabBarOpacity.toString() }}
            >
              <IonTabButton tab="tab1" href="/explore">
                <IonIcon
                  aria-hidden="true"
                  icon={compass}
                  color={currentTab == "tab1" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab2" href="/map">
                <IonIcon
                  aria-hidden="true"
                  icon={map}
                  color={currentTab == "tab2" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab3" href="/calendar">
                <IonIcon
                  aria-hidden="true"
                  icon={calendar}
                  color={currentTab == "tab3" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="tab4" href="/profile">
                <IonIcon
                  aria-hidden="true"
                  icon={person}
                  color={currentTab == "tab4" ? "primary" : ""}
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
