/**
 * @file Explore.tsx
 * @fileoverview First tab on the tab bar. The "Home" page of the application.
 * Contains swipers for different kinds of activities, as well as a search bar and a way to filter the activities.
 */

import { useRef, useState } from "react";
import { IonContent, IonItemDivider, IonPage, IonSearchbar, useIonViewDidEnter } from "@ionic/react";

import ExploreFilterButtons from "../components/Explore/ExploreFilterButtons";
import ExploreCarouselRecentlyViewed from "../components/Explore/ExploreCarouselRecentlyViewed";
import ExploreCarouselGeneral from "../components/Explore/ExploreCarouselGeneral";

import { useContext } from "../utils/hooks/useContext";
import useFetchData from "../utils/hooks/useFetchData";
import { GetHumspotEventResponse } from "../utils/types";
import { handleGetActivitiesGivenTag, handleGetThisWeeksEvents } from "../utils/server";

import "swiper/css";


const fetchHighlights = async (): Promise<any[] | null> => {
  const res = await handleGetActivitiesGivenTag(1, 'highlight');
  return res.activities ?? null;
};
const fetchUpcomingEvents = async (): Promise<GetHumspotEventResponse[] | null> => {
  const res = await handleGetThisWeeksEvents();
  return res.events ?? null;
};
const fetchAdventure = async (): Promise<any[] | null> => {
  const res = await handleGetActivitiesGivenTag(1, 'Adventure');
  return res.activities ?? null;
};
const fetchChill = async (): Promise<any[] | null> => {
  const res = await handleGetActivitiesGivenTag(1, 'Chill');
  return res.activities ?? null;
};

const ExplorePage = () => {
  const context = useContext();
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const [showFilterList, setShowFilterList] = useState<boolean>(false);

  const { data: highlights, loading: highlightsLoading, error: highlightsError } = useFetchData<any[] | null>(fetchHighlights);
  const { data: upcomingEvents, loading: upcomingEventsLoading, error: upcomingEventsError } = useFetchData<GetHumspotEventResponse[] | null>(fetchUpcomingEvents);
  const { data: adventure, loading: adventureLoading, error: adventureError } = useFetchData<any[] | null>(fetchAdventure);
  const { data: chill, loading: chillLoading, error: chillError } = useFetchData<any[] | null>(fetchChill);

  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  return (
    <IonPage className='ion-page-ios-notch'>
      <IonSearchbar placeholder="Search for Events" showCancelButton="focus" animated onClick={() => contentRef && contentRef.current && contentRef.current.scrollToTop(1000)} />

      <IonContent ref={contentRef}>
        <ExploreFilterButtons setShowFilterList={setShowFilterList} />
        {!showFilterList &&
          <>
            <ExploreCarouselRecentlyViewed />
            <div className='carousel-divider'></div>
            {!highlightsLoading && !highlightsError &&
              <section>
                <ExploreCarouselGeneral title='Highlights' hasTag activities={highlights} loading={highlightsLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
            {!upcomingEventsLoading && !upcomingEventsError &&
              <section>
                <ExploreCarouselGeneral title='Upcoming Events' activities={upcomingEvents} loading={upcomingEventsLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
            {!adventureLoading && !adventureError &&
              <section>
                <ExploreCarouselGeneral title='Adventure' hasTag activities={adventure} loading={adventureLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
            {!chillLoading && !chillError &&
              <section>
                <ExploreCarouselGeneral title='Chill Places' hasTag activities={chill} loading={chillLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
          </>
        }
      </IonContent>
    </IonPage>
  );
}

export default ExplorePage;
