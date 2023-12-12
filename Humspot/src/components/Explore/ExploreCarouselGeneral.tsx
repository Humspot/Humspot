/**
 * 
 */

import { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { IonCard, IonCardTitle, IonItemDivider, IonSkeletonText, IonText, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/functions/formatDate";

import placeholder from '../../assets/images/school_placeholder.jpeg';
import { CarouselLoadingSlides } from "./CarouselLoadingSlides";

type ExploreCarouselGeneralProps = {
  title: string;
  loading: boolean;
  activities: any[] | null;
};

const ExploreCarouselGeneral = (props: ExploreCarouselGeneralProps) => {

  const router = useIonRouter();
  const swiperRef = useRef<SwiperRef | null>(null);

  return (
    <>
      {props.activities && props.activities.length > 0 && !props.loading ?
        <IonItemDivider style={{ background: "var(--ion-background-color)", fontSize: "1.50rem" }}><IonText color='primary'>{props.title}</IonText></IonItemDivider>
        :
        props.loading &&
        <IonItemDivider style={{ background: "var(--ion-background-color)" }}><IonSkeletonText style={{ height: "1.5rem", width: "50vw" }} animated /></IonItemDivider>
      }
      {props.loading ?
        <CarouselLoadingSlides amount={4} />
        :
        <Swiper
          ref={swiperRef}
          slidesPerView={1.25}
          spaceBetween={20}
          style={{ width: '100%', height: 'auto' }}
        >
          {props.activities && props.activities.map((activity, index) => (
            <SwiperSlide key={index} style={{ width: 'auto', height: '100%' }}>
              <FadeIn delay={(index % 20) * 50}>
                <IonCard
                  style={{
                    '--background': 'var(--ion-background-color)',
                    height: '100%',
                    width: "100%"
                  }}
                  onClick={() => {
                    if ("activityID" in activity && activity.activityID) router.push("/activity/" + activity.activityID);
                  }}
                >
                  <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px' }}>
                    <img
                      src={"photoUrls" in activity && activity.photoUrls ? activity.photoUrls.trim().split(',')[0] : "photoUrl" in activity && activity.photoUrl ? activity.photoUrl : placeholder}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <IonCardTitle style={{ textAlign: 'left', paddingTop: "5px", fontSize: "1.35rem" }}>
                    {activity.name}
                  </IonCardTitle>
                  <p style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2.5px',
                    marginBottom: '2.5px',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    paddingTop: "5px"
                  }}>
                    {activity.description && activity.description.length > 1 ? activity.description : "No description available"}
                  </p>
                  {"eventDate" in activity && (
                    <p style={{ marginTop: 0, marginBottom: '5px', fontSize: '0.8rem', textAlign: 'left' }}>
                      <i>{formatDate(activity.eventDate)}</i>
                    </p>
                  )}
                </IonCard>
              </FadeIn>
            </SwiperSlide>
          ))}
        </Swiper>
      }

    </>
  );
};

export default ExploreCarouselGeneral;