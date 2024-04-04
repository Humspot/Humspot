/**
 * @file Explore.tsx
 * @fileoverview First tab on the tab bar. The "Home" page of the application.
 * Contains swipers for different kinds of activities, as well as a search bar and a way to filter the activities.
 */

import { useEffect, useRef, useState } from "react";
import { IonCol, IonContent, IonHeader, IonPage, IonRow, IonSearchbar, IonToolbar, useIonAlert, useIonRouter, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";

import ExploreFilterButtons from "../components/Explore/ExploreFilterButtons";
import ExploreCarouselRecentlyViewed from "../components/Explore/ExploreCarouselRecentlyViewed";
import ExploreCarouselGeneral from "../components/Explore/ExploreCarouselGeneral";

import useContext from "../utils/hooks/useContext";
import useFetchData from "../utils/hooks/useFetchData";
import { GetHumspotEventResponse } from "../utils/types";
import { handleGetActivitiesGivenTag, handleGetThisWeeksEvents } from "../utils/server";

import "swiper/css";
import { Keyboard } from "@capacitor/keyboard";
import { timeout } from "../utils/functions/timeout";
import Logo from '../assets/images/AppIcon_Home.png';


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
  const searchRef = useRef<HTMLIonSearchbarElement | null>(null);
  const pageRef = useRef();

  const router = useIonRouter();
  const [presentAlert] = useIonAlert();

  const [showFilterList, setShowFilterList] = useState<boolean>(false);

  const { data: highlights, loading: highlightsLoading, error: highlightsError } = useFetchData<any[] | null>(fetchHighlights);
  const { data: upcomingEvents, loading: upcomingEventsLoading, error: upcomingEventsError } = useFetchData<GetHumspotEventResponse[] | null>(fetchUpcomingEvents);
  const { data: adventure, loading: adventureLoading, error: adventureError } = useFetchData<any[] | null>(fetchAdventure);
  const { data: chill, loading: chillLoading, error: chillError } = useFetchData<any[] | null>(fetchChill);

  const handleClickLogo = () => {
    contentRef && contentRef.current && contentRef.current.scrollToTop(1000);
    presentAlert("Welcome to Humspot! Email dev@humspotapp.com to let us know what new features you would like to see!", [{ text: "Close" }])
  };

  const handleSearch = async (event: React.KeyboardEvent<HTMLIonSearchbarElement>) => {
    if (event.key === 'Enter' || event.key === 'search') {
      if (searchRef && searchRef.current && searchRef.current.value) {
        await Keyboard.hide();
        await timeout(300);
        router.push('/search/' + searchRef.current.value as string);
      }
    }
  };

  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  useIonViewWillEnter(() => {
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  return (
    <IonPage ref={pageRef}>

      <IonHeader className='ion-no-border profile-modal-content' mode='ios'>
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }} mode='ios'>
          <IonRow className='ion-no-padding ion-no-margin' style={{ paddingLeft: '5px' }}>
            <IonCol size='1.5'><img onClick={handleClickLogo} src={Logo} style={{ borderRadius: '5px' }} /></IonCol>
            <IonCol>
              <IonSearchbar
                ref={searchRef}
                onClick={() => contentRef && contentRef.current && contentRef.current.scrollToTop(1000)}
                placeholder="Search for Activities" spellcheck={true}
                type="search" enterkeyhint="search"
                autocorrect="off" showCancelButton="focus" animated={true}
                onKeyDown={e => handleSearch(e)}
              />
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef}>
        {/* <ExploreFilterButtons setShowFilterList={setShowFilterList} /> */}
        {!showFilterList &&
          <>
            <ExploreCarouselRecentlyViewed />
            <div className='carousel-divider'></div>
            {!upcomingEventsError &&
              <section>
                <ExploreCarouselGeneral title='Upcoming Events' activities={upcomingEvents} loading={upcomingEventsLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
            {/* {!highlightsError && highlights &&
              <section>
                <ExploreCarouselGeneral title='Highlights' button hasTag activities={highlights} loading={highlightsLoading} />
                <div className='carousel-divider'></div>
              </section>
            } */}
            {!adventureError &&
              <section>
                <ExploreCarouselGeneral title='Adventure' button hasTag activities={adventure} loading={adventureLoading} />
                <div className='carousel-divider'></div>
              </section>
            }
            {!chillError &&
              <section>
                <ExploreCarouselGeneral title='Chill Places' button hasTag activities={chill} loading={chillLoading} />
                {/* <div className='carousel-divider'></div> */}
              </section>
            }
            <div style={{ height: '15px' }} />
          </>
        }
      </IonContent>

    </IonPage>
  );
}

export default ExplorePage;
