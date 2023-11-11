import {
  IonContent,
  IonItemDivider,
  IonLoading,
  IonPage,
  IonSkeletonText,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./explore.css";
import "../components/Explore/CarouselEntry.css";
import "@ionic/react/css/ionic-swiper.css";
import CarouselEntry from "../components/Explore/CarouselEntry";
import SecondaryCarouselEntry from "../components/Explore/CarouselEntrySecondary";
import FilterButton from "../elements/FilterButton";

import { useCallback, useEffect, useState } from "react";
import {
  handleGetActivitiesGivenTag,
  handleGetActivity,
} from "../utils/server";
import { useToast } from "@agney/ir-toast";
import CarouselEntrySecondary from "../components/Explore/CarouselEntrySecondary";
import { useContext } from "../utils/my-context";


<link
  href="https://fonts.googleapis.com/css?family=Atkinson Hyperlegible"
  rel="stylesheet"
></link>;

function ExplorePage() {

  const [activitiesHighlight, setActivitiesHighlight] = useState<any>([]);
  const [activitiesHighlightLoading, setActivitiesHighlightLoading] =
    useState<boolean>(true);
  const Toast = useToast();
  const fetchActivitiesHighlight = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "fun");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setActivitiesHighlight(response.activities);
    setActivitiesHighlightLoading(false);
  }, []);

  const context = useContext();
  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  })

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

  return (
    <>
      <IonPage>
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
          <IonItemDivider className="Header" color={"primary"}>
            Highlights
          </IonItemDivider>
          <div className="MainCarousel">
            <Swiper slidesPerView={1.2}>
              {!activitiesHighlightLoading ? (
                activitiesHighlight.map((activity: any, index: any) => (
                  <SwiperSlide key={index}>
                    <div className="MainCarouselSlide">
                      <CarouselEntry
                        title={activity?.name}
                        description={activity?.description}
                        imgsrc={activity?.photoUrl}
                        id={activity?.activityID}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <IonSkeletonText style={{ height: "2rem" }} animated />
                </>
              )}
            </Swiper>
          </div>
          <IonItemDivider className="Header" color={"primary"}>
            Upcoming Events
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>
              {!activitiesSecondLoading ? (
                activitiesSecond.map((activity: any, index: any) => (
                  <SwiperSlide key={index}>
                    <div className="SecondaryCarouselSlide">
                      <CarouselEntrySecondary
                        title={activity?.name}
                        imgsrc={activity?.photoUrl}
                        id={activity?.activityID}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <IonSkeletonText style={{ height: "2rem" }} animated />
                </>
              )}
            </Swiper>
          </div>
          <IonItemDivider className="Header" color={"primary"}>
            Popular Spots
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>
              {!activitiesThirdLoading ? (
                activitiesThird.map((activity: any, index: any) => (
                  <SwiperSlide key={index}>
                    <div className="SecondaryCarouselSlide">
                      <CarouselEntrySecondary
                        title={activity?.name}
                        imgsrc={activity?.photoUrl}
                        id={activity?.activityID}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <IonSkeletonText style={{ height: "2rem" }} animated />
                </>
              )}
            </Swiper>
          </div>
          <IonItemDivider className="Header" color={"primary"}>
            Local Adventures
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>
              {!activitiesFourthLoading ? (
                activitiesFourth.map((activity: any, index: any) => (
                  <SwiperSlide key={index}>
                    <div className="SecondaryCarouselSlide">
                      <CarouselEntrySecondary
                        title={activity?.name}
                        imgsrc={activity?.photoUrl}
                        id={activity?.activityID}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <IonSkeletonText style={{ height: "2rem" }} animated />
                </>
              )}
            </Swiper>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
