import {
  IonContent,
  IonPage,
  useIonRouter,
  useIonViewDidEnter,
} from "@ionic/react";

import "swiper/css";
import "./Explore.css";
import "../components/Explore/CarouselEntry.css";
import "@ionic/react/css/ionic-swiper.css";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@agney/ir-toast";
import { useContext } from "../utils/my-context";
import { navigateBack } from "../components/Shared/BackButtonNavigation";
import ExploreFilterButtons from "../components/Explore/ExploreFilterButtons";
import ExploreCarouselRecentlyViewed from "../components/Explore/ExploreCarouselRecentlyViewed";
import ExploreCarouselGeneral from "../components/Explore/ExploreCarouselGeneral";
import { handleGetActivitiesGivenTag, handleGetThisWeeksEvents } from "../utils/server";

function ExplorePage() {

  const context = useContext();
  const router = useIonRouter();

  const [showFilterList, setShowFilterList] = useState<boolean>(false);

  const [highlights, setHighlights] = useState<any[]>([]);

  const fetchHighlights = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'highlight');
    setHighlights(res.activities);
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const fetchUpcomingEvents = useCallback(async () => {
    const res = await handleGetThisWeeksEvents();
    setUpcomingEvents(res.events);
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const [adventure, setAdventure] = useState<any[]>([]);

  const fetchAdventure = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'Adventure');
    setAdventure(res.activities);
  }, []);

  useEffect(() => {
    fetchAdventure();
  }, [fetchAdventure]);

  const [chill, setChill] = useState<any[]>([]);

  const fetchChill = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'Chill');
    setChill(res.activities);
  }, []);

  useEffect(() => {
    fetchChill();
  }, [fetchChill]);


  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, [])

  return (
    <>
      <IonPage className='ion-page-ios-notch'>
        <IonContent>

          <ExploreFilterButtons setShowFilterList={setShowFilterList} />
          {!showFilterList &&
            <>
              <ExploreCarouselRecentlyViewed />
              <ExploreCarouselGeneral title='Highlights' activities={highlights} />
              <ExploreCarouselGeneral title='Upcoming Events' activities={upcomingEvents} />
              <ExploreCarouselGeneral title='Chill Places' activities={chill} />
              <ExploreCarouselGeneral title='Adventure' activities={adventure} />
            </>
          }
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
