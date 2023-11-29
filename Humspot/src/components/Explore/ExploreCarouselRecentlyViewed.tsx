import { Preferences } from "@capacitor/preferences";
import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { useContext } from "../../utils/my-context";
import { IonCard, IonCardTitle, IonItemDivider, IonText, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/formatDate";

import placeholder from '../../assets/images/school_placeholder.jpeg';


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
        <IonItemDivider className='Header'><IonText color='primary'>Recently Viewed</IonText></IonItemDivider>
      }
      <Swiper
        ref={swiperRef}
        slidesPerView={1.25}
        spaceBetween={20}
        style={{ width: '100%', height: 'auto' }}
      >
        {recentActivities && recentActivities.map((activity, index) => (
          <SwiperSlide key={index} style={{ width: 'auto', height: '100%' }}>
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

export default ExploreCarouselRecentlyViewed;