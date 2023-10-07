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

setupIonicReact({mode:"md"});

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("tab1");
  function handleTabChange(event: CustomEvent<{ tab: string; }>): void {
    setCurrentTab(event.detail.tab);
  }

  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
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
        </IonRouterOutlet>
        <IonTabBar slot="bottom" color="primary" onIonTabsWillChange={handleTabChange}>
          <IonTabButton tab="tab1" href="/explore">
            <IonIcon aria-hidden="true" icon={compass} color={currentTab=="tab1"?"icon-highlight":"icon-dark"} size="large" />
            {/* <IonLabel>Tab 1</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="tab2" href="/map">
            <IonIcon aria-hidden="true" icon={map} color={currentTab=="tab2"?"icon-highlight":"icon-dark"} size="large"/>
            {/* <IonLabel>Tab 2</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="tab3" href="/calendar">
            <IonIcon aria-hidden="true" icon={calendar} color={currentTab=="tab3"?"icon-highlight":"icon-dark"} size="large"/>
            {/* <IonLabel>Tab 3</IonLabel> */}
          </IonTabButton>
          <IonTabButton tab="tab4" href="/profile">
            <IonIcon aria-hidden="true" icon={person} color={currentTab=="tab4"?"icon-highlight":"icon-dark"} size="large"/>
            {/* <IonLabel>Tab 3</IonLabel> */}
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
