import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
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
  ellipse,
  map,
  person,
  square,
  triangle,
} from "ionicons/icons";

import { useEffect } from "react";
import { guestUser, useContext } from "./my-context";
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
import ProfilePage from "./pages/profile";
import { useState } from "react";

import TestGoogleAuth from "./pages/TestGoogleAuth";
import { handleUserLogin } from "./server";
import { AWSLoginResponse } from "./types";

import AttractionPage from "./pages/attraction";

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
          break;
        case "signOut":
          console.log("signed out!");
          context.setHumspotUser(guestUser);
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
          console.log(JSON.stringify(res.user));
          context.setHumspotUser(res.user);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(guestUser);
    }
  };

  const [currentTab, setCurrentTab] = useState("tab1");
  function handleTabChange(event: CustomEvent<{ tab: string }>): void {
    setCurrentTab(event.detail.tab);
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/" render={() => <Redirect to="/explore" />} />
            <Route exact path="/explore">
              <ExplorePage></ExplorePage>
            </Route>
            <Route exact path="/calendar">
              <CalendarPage></CalendarPage>
            </Route>
            <Route exact path="/map">
              <MapPage></MapPage>
            </Route>
            <Route exact path="/profile">
              <ProfilePage></ProfilePage>
            </Route>
            <Route exact path="/google-auth">
              <TestGoogleAuth></TestGoogleAuth>
            </Route>
            <Route
              exact
              path="/attraction/:id"
              component={AttractionPage}
            ></Route>
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
            <IonTabButton
              tab="tab4"
              href={
                context.humspotUser == guestUser ? "/google-auth" : "/profile"
              }
            >
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
    </IonApp>
  );
};

export default App;
