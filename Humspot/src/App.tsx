import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, compass, ellipse, map, person, square, triangle } from 'ionicons/icons';

import { useEffect } from 'react';
import { guestUser, useContext } from './my-context';
import { Auth, Hub } from 'aws-amplify';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/custom.css';
import ExplorePage from './pages/explore';
import CalendarPage from './pages/calendar';
import MapPage from './pages/map';
import ProfilePage from './pages/profile';
import { useState } from 'react';

import TestGoogleAuth from './pages/TestGoogleAuth';
import { handleUserLogin } from './server';
import { AWSLoginResponse } from './types';

setupIonicReact({ mode: "md" });

const App: React.FC = () => {
  const context = useContext();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          const email: string | null = data?.signInUserSession?.idToken?.payload?.email ?? null;
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
      const email: string | null = currentUser?.signInUserSession?.idToken?.payload?.email ?? null;
      const awsUsername: string | null = currentUser?.username ?? null;
      handleUserLogin(email, awsUsername).then((res: AWSLoginResponse) => {
        console.log(res.message);
        if (!res.user) throw new Error(res.message);
        console.log(JSON.stringify(res.user));
        context.setHumspotUser(res.user);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(guestUser);
    }
  };

  const [currentTab, setCurrentTab] = useState("explore");
  function handleTabChange(event: CustomEvent<{ tab: string; }>): void {
    setCurrentTab(event.detail.tab);
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/explore" component={ExplorePage} />
            <Route exact path="/calendar" component={CalendarPage} />
            <Route exact path="/map" component={MapPage} />
            <Route exact path="/profile" component={TestGoogleAuth} />
            <Route exact path="/" render={() => <Redirect to="/explore" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom" color="primary" onIonTabsWillChange={handleTabChange}>
            <IonTabButton tab="explore" href="/explore">
              <IonIcon aria-hidden="true" icon={compass} color={currentTab == "explore" ? "icon-highlight" : "icon-dark"} size="large" />
              {/* <IonLabel>Tab 1</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="map" href="/map">
              <IonIcon aria-hidden="true" icon={map} color={currentTab == "map" ? "icon-highlight" : "icon-dark"} size="large" />
              {/* <IonLabel>Tab 2</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="calendar" href="/calendar">
              <IonIcon aria-hidden="true" icon={calendar} color={currentTab == "calendar" ? "icon-highlight" : "icon-dark"} size="large" />
              {/* <IonLabel>Tab 3</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon aria-hidden="true" icon={person} color={currentTab == "profile" ? "icon-highlight" : "icon-dark"} size="large" />
              {/* <IonLabel>Tab 3</IonLabel> */}
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>

  );
};

export default App;
