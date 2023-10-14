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
import { ellipse, square, triangle } from 'ionicons/icons';

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

import TestGoogleAuth from './pages/TestGoogleAuth';
import { handleUserLogin } from './server';


setupIonicReact();

const App: React.FC = () => {

  const context = useContext();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          const email: string | null = data?.signInUserSession?.idToken?.payload?.email ?? null;
          const awsUsername: string | null = data?.username ?? null;
          context.setHumspotUser({ email: email, awsUsername: awsUsername, imageUrl: '', role: 'user', loggedIn: true });
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
      context.setHumspotUser({ email: email, awsUsername: awsUsername, imageUrl: '', role: 'user', loggedIn: true });
      handleUserLogin(email, awsUsername).then(() => {
        console.log("CALLED");
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.error("Not signed in: " + error);
      context.setHumspotUser(guestUser);
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">

            </Route>
            <Route exact path="/google-auth">
              <TestGoogleAuth />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={triangle} />
              <IonLabel>Tab 1</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={ellipse} />
              <IonLabel>Tab 2</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={square} />
              <IonLabel>Tab 3</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
