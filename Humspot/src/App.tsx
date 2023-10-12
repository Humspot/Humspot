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
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useCallback, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useContext } from './my-context';
import { HumspotUser } from './types';
import { setGuestUser } from './server';

setupIonicReact();

const App: React.FC = () => {

  const context = useContext();

  const handleCheckAuth = useCallback(async () => {
    const user = await Preferences.get({ key: "humspotUser" });
    if (user.value) {
      context.setHumspotUser(JSON.parse(user.value) as HumspotUser);
    } else {
      setGuestUser();
    }
  }, []);

  useEffect(() => {
    handleCheckAuth();
  }, []);

  useEffect(() => {
    GoogleAuth.initialize({
      clientId: '598830997052-ocvgr72soka88ocpidvi3neu0ho6c819.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }, []);

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
