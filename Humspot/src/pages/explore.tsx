import {
  IonContent,
  IonPage,
  useIonRouter,
  useIonViewWillEnter,
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
import { handleGetActivitiesGivenTag } from "../utils/server";

function ExplorePage() {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        navigateBack(router);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  });

  const [showFilterList, setShowFilterList] = useState<boolean>(false);

  const [highlights, setHighlights] = useState<any[]>([]);

  const fetchHighlights = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'highlight');
    setHighlights(res.activities);
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights])

  return (
    <>
      <IonPage>

        <IonContent>

          <ExploreFilterButtons setShowFilterList={setShowFilterList} />
          {!showFilterList &&
            <>
              <ExploreCarouselRecentlyViewed />
              <ExploreCarouselGeneral title='Highlights' activities={highlights} />
              <ExploreCarouselGeneral title='Upcoming Events' activities={highlights} />
              <ExploreCarouselGeneral title='Chill Places' activities={highlights} />
              <ExploreCarouselGeneral title='Adventure' activities={highlights} />
            </>
          }
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
