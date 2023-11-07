import {
  IonContent,
  IonItemDivider,
  IonPage,
  IonSkeletonText,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./explore.css";
import "../elements/CarouselEntry.css";
import "@ionic/react/css/ionic-swiper.css";
import CarouselEntry from "../elements/CarouselEntry";
import SecondaryCarouselEntry from "../elements/CarouselEntrySecondary";
import FilterButton from "../elements/FilterButton";
import { useCallback, useEffect, useState } from "react";
import {
  handleGetActivitiesGivenTag,
  handleGetActivity,
} from "../utils/server";
import { useToast } from "@agney/ir-toast";

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

  useEffect(() => {
    fetchActivitiesHighlight();
  }, [fetchActivitiesHighlight]);

  const highlightArray = [
    "14599af9152000ad4da9dea9e",
    "08d4f2112bb9d001127b76614",
    "0ab3c60b786604c49f9b063e5",
    "0d8517d295844cf801ee35a38",
    "0e4abb4d64b352c7cc883688e",
    "0ffd5280201e65b0f3fc1d309",
  ];

  const mainCarouselData = [
    {
      title: "title 1",
      description: "This is the first slide",
      imgsrc:
        "https://activityphotos.s3.us-west-1.amazonaws.com/event-photos/715d07c9d97dde03808d03bb-R7CeCVUf-1697853939858-jpeg",
      id: highlightArray[0],
    },
    {
      title: "Redwood Fest",
      description: "This is the first slide",
      imgsrc:
        "https://activityphotos.s3.us-west-1.amazonaws.com/event-photos/715d07c9d97dde03808d03bb-R7CeCVUf-1697853939858-jpeg",
      id: highlightArray[1],
    },
  ];

  const secondCarouselData = [
    {
      title: "Attraction 1",
      imgsrc: "https://source.unsplash.com/random/?forest,cloud",
    },
    {
      title: "Attraction 2",
      imgsrc: "https://source.unsplash.com/random/?forest,cloud,trail",
    },
    {
      title: "Attraction 3",
      imgsrc: "https://source.unsplash.com/random/?beach,cloud",
    },
    {
      title: "Attraction 4",
      imgsrc: "https://source.unsplash.com/random/?beach,cloud,trail",
    },
  ];

  const thirdCarouselData = [
    {
      title: "Attraction 1",
      imgsrc: "https://source.unsplash.com/random/?forest,day",
    },
    {
      title: "Attraction 2",
      imgsrc: "https://source.unsplash.com/random/?forest,day,trail",
    },
    {
      title: "Attraction 3",
      imgsrc: "https://source.unsplash.com/random/?beach,day",
    },
    {
      title: "Attraction 4",
      imgsrc: "https://source.unsplash.com/random/?beach,day,trail",
    },
  ];

  const fourthCarouselData = [
    {
      title: "Attraction 1",
      imgsrc: "https://source.unsplash.com/random/?forest,woods",
    },
    {
      title: "Attraction 2",
      imgsrc: "https://source.unsplash.com/random/?forest,woods,trail",
    },
    {
      title: "Attraction 3",
      imgsrc: "https://source.unsplash.com/random/?beach,night",
    },
    {
      title: "Attraction 4",
      imgsrc: "https://source.unsplash.com/random/?beach,trail,night",
    },
  ];

  const secondCarouselEntries = secondCarouselData.map((data, index) => (
    <SwiperSlide key={index}>
      <div className="SecondaryCarouselSlide">
        <SecondaryCarouselEntry
          title={data.title}
          imgsrc={data.imgsrc}
          id={index}
        />
      </div>
    </SwiperSlide>
  ));

  const thirdCarouselEntries = thirdCarouselData.map((data, index) => (
    <SwiperSlide key={index}>
      <div className="SecondaryCarouselSlide">
        <SecondaryCarouselEntry
          title={data.title}
          imgsrc={data.imgsrc}
          id={index}
        />
      </div>
    </SwiperSlide>
  ));

  const fourthCarouselEntries = fourthCarouselData.map((data, index) => (
    <SwiperSlide key={index}>
      <div className="SecondaryCarouselSlide">
        <SecondaryCarouselEntry
          title={data.title}
          imgsrc={data.imgsrc}
          id={index}
        />
      </div>
    </SwiperSlide>
  ));

  return (
    <>
      <IonPage>
        <FilterButton></FilterButton>
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
                        title={activity?.title}
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
            Chill Places
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>{secondCarouselEntries}</Swiper>
          </div>
          <IonItemDivider className="Header" color={"primary"}>
            Short Notice
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>{thirdCarouselEntries}</Swiper>
          </div>
          <IonItemDivider className="Header" color={"primary"}>
            Adventure
          </IonItemDivider>
          <div className="SecondaryCarousel">
            <Swiper slidesPerView={1.2}>{fourthCarouselEntries}</Swiper>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}

export default ExplorePage;
