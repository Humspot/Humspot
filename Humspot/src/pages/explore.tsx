import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonPage,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "./explore.css";
import "../elements/CarouselEntry.css";
import "@ionic/react/css/ionic-swiper.css";
import CarouselEntry from "../elements/CarouselEntry";
import SecondaryCarouselEntry from "../elements/CarouselEntrySecondary";
import { add, fileTrayStackedSharp, filter, filterSharp } from "ionicons/icons";
import FilterButton from "../elements/FilterButton";
import { useState, useCallback, useEffect } from "react";
import { handleGetActivity, handleGetEvent } from "../utils/server";
import { useParams } from "react-router-dom";
import { useContext } from "../utils/my-context";

<link
  href="https://fonts.googleapis.com/css?family=Atkinson Hyperlegible"
  rel="stylesheet"
></link>;

function ExplorePage() {
  const router = useIonRouter();
  const context = useContext();
  const { id }: any = useParams();
  const [activity, setActivity] = useState<any>(null);
  const handleGetActivityCallback = useCallback(async (id: string) => {
    const res = await handleGetActivity(id);
    if ("event" in res && res.event) setActivity(res.event);
  }, []);
  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  })
  useEffect(() => {
    if (id) handleGetActivityCallback(id);
  }, [id]);
  const mainCarouselData = [
    {
      title: "Redwood Fest",
      description: "This is the first slide",
      imgsrc:
        "https://activityphotos.s3.us-west-1.amazonaws.com/event-photos/715d07c9d97dde03808d03bb-R7CeCVUf-1697853939858-jpeg",
      id: "14599af9152000ad4da9dea9e",
    },
    {
      title: "Redwood Fest",
      description: "This is the first slide",
      imgsrc:
        "https://activityphotos.s3.us-west-1.amazonaws.com/event-photos/715d07c9d97dde03808d03bb-R7CeCVUf-1697853939858-jpeg",
      id: "14599af9152000ad4da9dea9e",
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

  const mainCarouselEntries = mainCarouselData.map((data, index) => (
    <SwiperSlide key={index}>
      <div className="MainCarouselSlide">
        <CarouselEntry
          title={data.title}
          description={data.description}
          imgsrc={data.imgsrc}
          id={data.id}
        />
      </div>
    </SwiperSlide>
  ));

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
            <Swiper slidesPerView={1.2}>{mainCarouselEntries}</Swiper>
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
