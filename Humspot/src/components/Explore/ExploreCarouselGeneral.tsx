import { Preferences } from "@capacitor/preferences";
import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { useContext } from "../../utils/my-context";
import { IonCard, IonCardTitle, IonItemDivider, IonText, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/formatDate";

import placeholder from '../../assets/images/school_placeholder.jpeg';
import { handleGetActivitiesGivenTag } from "../../utils/server";

type ExploreCarouselGeneralProps = {
  title: string;
  activities: any[];
}

const ExploreCarouselGeneral = (props: ExploreCarouselGeneralProps) => {

  const context = useContext();
  const router = useIonRouter();

  const swiperRef = useRef<SwiperRef | null>(null);

  return (
    <>
      {props.activities.length > 0 &&
        <IonItemDivider className='Header'><IonText color='primary'>{props.title}</IonText></IonItemDivider>
      }
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
                    src={activity.photoUrl ? activity.photoUrl : placeholder}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <IonCardTitle style={{ textAlign: 'left', paddingTop: "5px" }}>
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
    </>
  );
};

export default ExploreCarouselGeneral;