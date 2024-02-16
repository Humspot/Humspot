/**
 * @file ExploreCarouselRecentlyViewed.tsx
 * @fileoverview use Capacitor Preferences (local storage) to show users recently viewed activities on the Explore page.
 * This will update with the most recently viewed activities every time the user visits the Explore page.
 * @see /src/utils/updateRecentlyViewed.ts
 */

import { Preferences } from "@capacitor/preferences";
import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { IonCard, IonCardTitle, IonItemDivider, IonText, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

import { useContext } from "../../utils/hooks/useContext";
import { formatDate } from "../../utils/functions/formatDate";

import placeholder from '../../assets/images/school_placeholder.jpeg';

import './Explore.css';

const ExploreCarouselRecentlyViewed = () => {

  const context = useContext();
  const router = useIonRouter();

  const swiperRef = useRef<SwiperRef | null>(null);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchRecentActivities = useCallback(async () => {
    const result = await Preferences.get({ key: "recentlyViewed" });
    if (result.value) {
      const recentlyViewedArr: any[] = JSON.parse(result.value);
      const reversed = recentlyViewedArr.reverse();
      setRecentActivities(reversed ?? []);
    }
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0, 1000);
    }
    context.setRecentlyViewedUpdated(false);
  }, []);

  useIonViewWillEnter(() => {
    if (context.recentlyViewedUpdated) fetchRecentActivities();
  }, [context.recentlyViewedUpdated]);

  useEffect(() => {
    fetchRecentActivities();
  }, [])

  return (
    <>
      {recentActivities.length > 0 &&
        <IonItemDivider mode='ios' style={{ background: "var(--ion-background-color)", fontSize: "1.50rem", paddingTop: '10px' }}><IonText color='primary'>Recently Viewed</IonText></IonItemDivider>
      }
      <Swiper
        ref={swiperRef}
        slidesPerView={1.25}
        spaceBetween={0}
        threshold={20}
        cssMode={true}
        resistanceRatio={0.5}
        style={{ width: '100%', height: 'auto' }}
      >
        {recentActivities && recentActivities.map((activity, index) => (
          <SwiperSlide key={index} style={{ width: 'auto', height: '100%', paddingRight: "20px" }}>
            <FadeIn delay={(index % 20) * 50}>
              <IonCard
                style={{
                  '--background': 'var(--ion-background-color)',
                  height: '100%',
                  width: "100%"
                }}
                onClick={() => {
                  if ("id" in activity && activity.id) router.push("/activity/" + activity.id);
                }}
              >
                <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px', border: '1px solid var(--ion-color-medium)' }}>
                  <img
                    src={activity.photoUrl ? activity.photoUrl.trim().split(',')[0] : placeholder}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
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
                    <p style={{ marginTop: 0, marginBottom: '5px', fontSize: '0.8rem', paddingLeft: '1px', textAlign: 'left' }}>
                      <i>{formatDate(activity.date)}</i>
                    </p>
                  )
                }
              </IonCard>
            </FadeIn>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ExploreCarouselRecentlyViewed;