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
import { handleGetActivitiesGivenTag } from "../utils/server";

function ExplorePage() {

  const context = useContext();
  const router = useIonRouter();
  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  });

  useEffect(() => {
    fetchActivitiesHighlight();
  }, [fetchActivitiesHighlight]);

  const [activitiesSecond, setActivitiesSecond] = useState<any>([]);
  const [activitiesSecondLoading, setActivitiesSecondLoading] =
    useState<boolean>(true);
  const fetchActivitiesSecond = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "School");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setActivitiesSecond(response.activities);
    setActivitiesSecondLoading(false);
  }, []);

  useEffect(() => {
    fetchActivitiesSecond();
  }, [fetchActivitiesSecond]);

  const [activitiesThird, setActivitiesThird] = useState<any>([]);
  const [activitiesThirdLoading, setActivitiesThirdLoading] =
    useState<boolean>(true);
  const fetchActivitiesThird = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "hsu");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setActivitiesThird(response.activities);
    setActivitiesThirdLoading(false);
  }, []);

  useEffect(() => {
    fetchActivitiesThird();
  }, [fetchActivitiesThird]);

  const [activitiesFourth, setActivitiesFourth] = useState<any>([]);
  const [activitiesFourthLoading, setActivitiesFourthLoading] =
    useState<boolean>(true);
  const fetchActivitiesFourth = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "School");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setActivitiesFourth(response.activities);
    setActivitiesFourthLoading(false);
  }, []);

  useEffect(() => {
    fetchActivitiesFourth();
  }, [fetchActivitiesFourth]);

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
      <IonPage className='ion-page-ios-notch'>
        <FilterButton></FilterButton>
        <IonLoading
          isOpen={
            activitiesHighlightLoading &&
            activitiesSecondLoading &&
            activitiesThirdLoading &&
            activitiesFourthLoading
          }
          message={"Loading..."}
        />
        <IonContent>

          <ExploreFilterButtons setShowFilterList={setShowFilterList} />
          {!showFilterList &&
            <>
              <ExploreCarouselRecentlyViewed />
              <ExploreCarouselGeneral title='Highlights' activities={highlights} />
              <ExploreCarouselGeneral title='Highlights' activities={highlights} />
            </>
          }
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
