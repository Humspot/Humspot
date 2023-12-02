import {
  IonContent,
  IonPage,
  IonSearchbar,
  useIonRouter,
  useIonViewDidEnter,
} from "@ionic/react";

import "swiper/css";
import "./Explore.css";
import "../components/Explore/CarouselEntry.css";
import "@ionic/react/css/ionic-swiper.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useContext } from "../utils/my-context";
import ExploreFilterButtons from "../components/Explore/ExploreFilterButtons";
import ExploreCarouselRecentlyViewed from "../components/Explore/ExploreCarouselRecentlyViewed";
import ExploreCarouselGeneral from "../components/Explore/ExploreCarouselGeneral";
import { handleGetActivitiesGivenTag, handleGetThisWeeksEvents } from "../utils/server";

function ExplorePage() {

  const context = useContext();

  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const [showFilterList, setShowFilterList] = useState<boolean>(false);

  const [highlightsLoading, setHighlightsLoading] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<any[]>([]);

  const fetchHighlights = useCallback(async () => {
    setHighlightsLoading(true);
    const res = await handleGetActivitiesGivenTag(1, 'highlight');
    setHighlights(res.activities);
    setHighlightsLoading(false);
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const [upcomingEventsLoading, setUpcomingEventsLoading] = useState<boolean>(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const fetchUpcomingEvents = useCallback(async () => {
    setUpcomingEventsLoading(true);
    const res = await handleGetThisWeeksEvents();
    setUpcomingEvents(res.events);
    setUpcomingEventsLoading(false);
  }, []);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const [adventureLoading, setAdventureLoading] = useState<boolean>(false);
  const [adventure, setAdventure] = useState<any[]>([]);

  const fetchAdventure = useCallback(async () => {
    setAdventureLoading(true);
    const res = await handleGetActivitiesGivenTag(1, 'Adventure');
    setAdventure(res.activities);
    setAdventureLoading(false);
  }, []);

  useEffect(() => {
    fetchAdventure();
  }, [fetchAdventure]);

  const [chillLoading, setChillLoading] = useState<boolean>(false);
  const [chill, setChill] = useState<any[]>([]);

  const fetchChill = useCallback(async () => {
    setChillLoading(true);
    const res = await handleGetActivitiesGivenTag(1, 'Chill');
    setChill(res.activities);
    setChillLoading(false);
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
        <IonSearchbar onClick={() => contentRef && contentRef.current && contentRef.current.scrollToTop(1000)} />

        <IonContent ref={contentRef}>

          <ExploreFilterButtons setShowFilterList={setShowFilterList} />
          {!showFilterList &&
            <>
              <ExploreCarouselRecentlyViewed />
              <ExploreCarouselGeneral title='Highlights' activities={highlights} loading={highlightsLoading} />
              <ExploreCarouselGeneral title='Upcoming Events' activities={upcomingEvents} loading={upcomingEventsLoading} />
              <ExploreCarouselGeneral title='Chill Places' activities={chill} loading={chillLoading} />
              <ExploreCarouselGeneral title='Adventure' activities={adventure} loading={adventureLoading} />
            </>
          }
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
