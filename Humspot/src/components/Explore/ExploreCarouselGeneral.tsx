/**
 * @file ExploreCarouselGeneral.tsx
 * @fileoverview Carousel that takes in an array of activities and renders them in a Swiper list.
 */

import { useEffect, useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { IonButton, IonCard, IonCardTitle, IonIcon, IonItemDivider, IonSkeletonText, IonText, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/functions/formatDate";

import placeholder from '../../assets/images/school_placeholder.jpeg';
import { ExploreCarouselLoadingSlides } from "./ExploreCarouselLoadingSlides";

import './Explore.css';
import { arrowForward } from "ionicons/icons";
import { timeout } from "../../utils/functions/timeout";

type ExploreCarouselGeneralProps = {
  title: string;
  hasTag?: boolean;
  loading: boolean;
  activities: any[] | null;
};

const ExploreCarouselGeneral = (props: ExploreCarouselGeneralProps) => {

  const router = useIonRouter();
  const swiperRef = useRef<SwiperRef | null>(null);

  const handleClickArrow = (e: any): void => {
    e.preventDefault();
    if (props.hasTag) {
      router.push(`/more-results/${encodeURIComponent(props.title.trim())}`);
    } else {
      router.push("/upcoming-events");
    }
  }

  useEffect(() => {
    if (props.activities && !props.loading && swiperRef.current) {
      timeout(100).then(() => {
        if (props.activities && !props.loading && swiperRef.current) {
          swiperRef.current.swiper.slideTo(0, 1000);
        }
      })
    }
  }, [props.activities, props.loading, swiperRef]);

  return (
    <>
      {props.activities && props.activities.length > 0 && !props.loading ?
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <IonItemDivider mode='ios' style={{ background: "var(--ion-background-color)", fontSize: "1.50rem", paddingTop: '10px' }}><IonText onClick={handleClickArrow} color='primary'>{props.title}</IonText></IonItemDivider>
          <IonButton fill='clear' style={{ paddingTop: "10px" }} onClick={handleClickArrow}><IonIcon color='primary' icon={arrowForward}></IonIcon></IonButton>
        </div>
        :
        props.loading &&
        <IonItemDivider mode='ios' style={{ background: "var(--ion-background-color)", paddingTop: '10px' }}><IonSkeletonText style={{ height: "1.5rem", width: "50vw", marginTop: "15px" }} animated /></IonItemDivider>
      }
      {props.loading ?
        <ExploreCarouselLoadingSlides amount={4} />
        :
        <Swiper
          ref={swiperRef}
          slidesPerView={1.25}
          spaceBetween={0}
          threshold={20}
          cssMode={true}
          resistanceRatio={0.5}
          style={{ width: '100%', height: 'auto' }}
          breakpoints={{
            320: {
              slidesPerView: 1.25,
            },
            480: {
              slidesPerView: 1.25,
            },
            720: {
              slidesPerView: 2.25,
            },
            1024: {
              slidesPerView: 3.25,
            }
          }}
        >
          {props.activities && props.activities.map((activity, index) => (
            <SwiperSlide key={index} style={{ width: 'auto', height: '100%', paddingRight: "20px" }}>
              <FadeIn delay={(index % 20) * 50}>
                <IonCard
                  style={{
                    '--background': 'var(--ion-background-color)',
                    height: '100%',
                    width: "100%",
                  }}
                  onClick={() => {
                    if ("activityID" in activity && activity.activityID) router.push("/activity/" + activity.activityID);
                  }}
                >
                  <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px', border: '1px solid var(--ion-color-medium)' }}>
                    <img
                      src={"photoUrls" in activity && activity.photoUrls ? activity.photoUrls.trim().split(',')[0] : "photoUrl" in activity && activity.photoUrl ? activity.photoUrl : placeholder}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <IonCardTitle style={{ textAlign: 'left', paddingLeft: '1px', paddingTop: "5px", fontSize: "1.35rem" }}>
                    {activity.name}
                  </IonCardTitle>
                  <p className='explore-carousel-activity-description'>
                    {activity.description && activity.description.length > 1 ? activity.description : "No description available"}
                  </p>
                  {"eventDate" in activity ? (
                    <p style={{ marginTop: 0, marginBottom: '5px', paddingLeft: '1px', fontSize: '0.8rem', textAlign: 'left' }}>
                      <i>{formatDate(activity.eventDate)}</i>
                    </p>
                  ) :
                    "date" in activity && (
                      <p style={{ marginTop: '5px', fontSize: '0.8rem', paddingLeft: '1px', textAlign: 'left' }}>
                        <i>{formatDate(activity.date)}</i>
                      </p>
                    )
                  }
                </IonCard>
              </FadeIn>
            </SwiperSlide>
          ))}
        </Swiper >
      }

    </>
  );
};

export default ExploreCarouselGeneral;