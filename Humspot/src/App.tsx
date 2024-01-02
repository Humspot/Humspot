/**
 * @file App.tsx
 * @fileoverview Routes and main application components.
 */

import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendar, compass, map, person } from "ionicons/icons";
import { SplashScreen } from '@capacitor/splash-screen';

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

import Explore from "./pages/Explore";
import Calendar from "./pages/Calendar";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import SubmitEvent from "./pages/SubmitEvent";
import SubmitAttraction from "./pages/SubmitAttraction";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SubmittedActivities from "./pages/SubmittedActivities";
import BecomeACoordinator from "./pages/BecomeACoordinator";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApproveActivitySubmission from "./pages/AdminApproveActivitySubmission";

import useAWSAuth from "./utils/hooks/useAWSAuth";
import useDarkMode from "./utils/hooks/useDarkMode";
import useTabBarVisibility from "./utils/hooks/useTabBarVisibility";
import { useContext } from "./utils/hooks/useContext";

import { ToastProvider } from "@agney/ir-toast";
import MoreResults from "./pages/MoreResults";
import ContactUs from "./pages/ContactUs";
import AppUrlRouter from "./AppUrlRouter";
import Search from "./pages/Search";

setupIonicReact({ mode: "ios" });

SplashScreen.show();

const App: React.FC = () => {

  const context = useContext();
  useAWSAuth(context); useDarkMode(context);

  const { tabBarDisplay, tabBarOpacity } = useTabBarVisibility(context);

  const [currentTab, setCurrentTab] = useState("explore");

  return (
    <IonApp>
      <ToastProvider>
        <IonReactRouter>

          <AppUrlRouter></AppUrlRouter>

          <IonTabs className={context.showTabs ? 'tab-bar-visible' : 'tab-bar-hidden'}>
            <IonRouterOutlet>
              <Route exact path="/" render={() => <Redirect to="/explore" />} />
              <Route exact path="/redirect-sign-in" render={() => <Redirect to="/explore" />} />
              <Route exact path="/explore" component={Explore} />
              <Route exact path="/calendar" component={Calendar} />
              <Route exact path="/map" component={Map} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/sign-up" component={SignUp} />
              <Route exact path="/sign-in" component={SignIn} />
              <Route exact path="/contact-us" component={ContactUs} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route exact path="/terms-and-conditions" component={TermsAndConditions} />
              <Route exact path="/privacy-policy" component={PrivacyPolicy} />
              <Route exact path="/become-a-coordinator" component={BecomeACoordinator} />
              <Route exact path="/admin-dashboard" component={AdminDashboard} />
              <Route exact path="/admin-dashboard/submission/:id" component={AdminApproveActivitySubmission} />
              <Route exact path="/verify-email/:email/:toVerify" component={VerifyEmail} />
              <Route exact path="/submit-event" component={SubmitEvent} />
              <Route exact path="/submit-attraction" component={SubmitAttraction} />
              <Route exact path="/submitted-activities" component={SubmittedActivities} />
              <Route exact path="/activity/:id" component={Activity} />
              <Route exact path="/search/:query" component={Search} />
              <Route exact path="/more-results/:tagName" component={MoreResults} />
            </IonRouterOutlet>

            <IonTabBar
              id='main-tab-bar'
              slot="bottom"
              onIonTabsWillChange={(e) => { setCurrentTab(e.detail.tab); }}
              style={{ display: tabBarDisplay, opacity: tabBarOpacity.toString() }}
            >
              <IonTabButton tab="explore" href="/explore">
                <IonIcon
                  aria-hidden="true"
                  icon={compass}
                  color={currentTab == "explore" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="map" href="/map">
                <IonIcon
                  aria-hidden="true"
                  icon={map}
                  color={currentTab == "map" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="calendar" href="/calendar">
                <IonIcon
                  aria-hidden="true"
                  icon={calendar}
                  color={currentTab == "calendar" ? "primary" : ""}
                  size="large"
                />
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <IonIcon
                  aria-hidden="true"
                  icon={person}
                  color={currentTab == "profile" ? "primary" : ""}
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
