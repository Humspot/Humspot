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

import { useEffect } from "react";
import { useContext } from "./utils/my-context";
import { Auth, Hub } from "aws-amplify";

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
import "./theme/custom.css";

import ExplorePage from "./pages/explore";
import CalendarPage from "./pages/calendar";
import MapPage from "./pages/map";
import ProfilePage from "./pages/ProfilePage";
import { useState } from "react";

import TestGoogleAuth from "./pages/TestGoogleAuth";
import { handleUserLogin } from "./utils/server";
import { AWSLoginResponse } from "./utils/types";

import AttractionPage from "./pages/attraction";

import EventForm from "./pages/EventForm";

import { ToastProvider } from "@agney/ir-toast";
import SubmitEventPage from "./pages/SubmitEvent";

import TermsAndConditions from "./pages/TermsAndConditions";

import PrivacyPolicy from "./pages/PrivacyPolicy";

setupIonicReact({ mode: "md" });

const App: React.FC = () => {
  const context = useContext();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          const email: string | null =
            data?.signInUserSession?.idToken?.payload?.email ?? null;
          const awsUsername: string | null = data?.username ?? null;
          getUser();
          break;
        case "signOut":
          console.log("signed out!");
          context.setHumspotUser(null);
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
      handleUserLogin(email, awsUsername)
        .then((res: AWSLoginResponse) => {
          console.log(res.message);
          if (!res.user) throw new Error(res.message);
          console.log(res.user);
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
              <Route exact path="/google-auth" component={TestGoogleAuth} />
              <Route exact path="/event-form" component={EventForm} />
              <Route exact path="/attraction/:id" component={AttractionPage} />
              <Route exact path="/TermsAndConditions" component={TermsAndConditions} />
              <Route exact path="/PrivacyPolicy" component={PrivacyPolicy} /> 
            </IonRouterOutlet>

            <IonTabBar
              slot="bottom"
              color="primary"
              onIonTabsWillChange={handleTabChange}
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
