/**
 * @file App.tsx
 * @fileoverview Routes and main application components.
 * 
 * @note this is the iOS version of the application!
 */

import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonButton, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { addCircleOutline, calendar, compass, map, person } from "ionicons/icons";
import { SplashScreen } from '@capacitor/splash-screen';
import { ToastProvider } from "@agney/ir-toast";

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
import BecomeACoordinator from "./pages/BecomeAnOrganizer";
import AdminDashboard from "./pages/AdminDashboard";
import MoreResults from "./pages/MoreResults";
import ContactUs from "./pages/ContactUs";
import Search from "./pages/Search";
import AdminApproveActivitySubmission from "./pages/AdminApproveActivitySubmission";

import AppUrlRouter from "./AppUrlRouter";
import useAWSAuth from "./utils/hooks/useAWSAuth";
import useDarkMode from "./utils/hooks/useDarkMode";
import useTabBarVisibility from "./utils/hooks/useTabBarVisibility";
import useContext from "./utils/hooks/useContext";
import usePushNotifications from "./utils/hooks/usePushNotifications";
import ProfileActivitiesModal from "./components/Shared/ActivitiesModal";
import User from "./pages/User";
import ApprovedActivitiesPage from "./pages/ApprovedActivities";
import UpcomingEvents from "./pages/UpcomingEvents";


setupIonicReact({ mode: "ios" });
SplashScreen.show();

const RoutingSystem: React.FC = () => {

  const context = useContext();
  const { tabBarDisplay, tabBarOpacity } = useTabBarVisibility(context);

  useAWSAuth(context);
  useDarkMode(context);
  usePushNotifications();

  const [currentTab, setCurrentTab] = useState("explore");

  return (
    <>

      {/* Handles opening of links on mobile, https://humspotapp.com/{route} */}
      <AppUrlRouter></AppUrlRouter>

      {/* Routes and tab bar */}
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
          <Route exact path="/approved-activities" component={ApprovedActivitiesPage} />
          <Route exact path="/upcoming-events" component={UpcomingEvents} />
          <Route exact path="/activity/:id" component={Activity} />
          <Route exact path="/search/:query" component={Search} />
          <Route exact path="/more-results/:tagName" component={MoreResults} />
          <Route exact path="/user/:uid" component={User} />
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
          <IonTabButton>
            <IonButton fill='clear' id='open-add-activity-modal' color=''>
              <IonIcon
                aria-hidden="true"
                icon={addCircleOutline}
                color={context.darkMode ? 'medium' : 'warning'}
                size="large"
                style={{ transform: "scale(1.1)" }}
              />
            </IonButton>
          </IonTabButton>
          <IonTabButton tab="calendar" href="/calendar">
            <IonIcon
              aria-hidden="true"
              icon={calendar}
              color={currentTab == "calendar" ? "primary" : ""}
              size="large"
            />
          </IonTabButton>
          <IonTabButton tab="profile" href={context.humspotUser ? "/profile" : "/sign-up"}>
            <IonIcon
              aria-hidden="true"
              icon={person}
              color={currentTab == "profile" ? "primary" : ""}
              size="large"
            />
          </IonTabButton>
        </IonTabBar>

      </IonTabs>

      {/* Global slide-up modal where users can request to submit events/attractions */}
      <ProfileActivitiesModal />

    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <ToastProvider>
        <IonReactRouter>
          <RoutingSystem></RoutingSystem>
        </IonReactRouter>
      </ToastProvider>
    </IonApp>
  );
}

export default App;
