import { Preferences } from "@capacitor/preferences";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext } from "../../utils/my-context";
import { IonCard, IonCardTitle, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/formatDate";

import placeholder from '../../assets/images/placeholder.png';


const CarouselRecentlyViewed = () => {

  const context = useContext();
  const router = useIonRouter();

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      const result = await Preferences.get({ key: "recentlyViewed" });
      if (result.value) {
        const recentlyViewedArr = JSON.parse(result.value);
        console.log(recentlyViewedArr);
        setRecentActivities(recentlyViewedArr ?? []);
      }
    };
    console.log('hello')
    fetchRecentActivities();
  }, [context.recentlyViewedUpdated]);

  return (
    <>
      <Swiper slidesPerView={1.2}>
        {recentActivities && recentActivities.map((activity: any, index: number) => (
          <SwiperSlide key={index}>
            <FadeIn key={index} delay={(index % 20) * 50}>
              <IonCard style={{ '--background': 'var(--ion-background-color)', paddingLeft: "5px", paddingRight: "5px" }} onClick={() => { if ("id" in activity && activity.id) router.push("/activity/" + activity.id) }}>
                <div style={{ height: '175px', overflow: 'hidden', borderRadius: "10px" }}>
                  <img
                    src={activity.photoUrl ? activity.photoUrl : placeholder}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <IonCardTitle style={{ marginTop: "5px" }}>{activity.name}</IonCardTitle>
                <p style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2.5px',
                  marginBottom: '2.5px',
                  fontSize: "0.9rem"
                }}>
                  {activity.description}
                </p>
                {"eventDate" in activity &&
                  <p style={{ marginTop: 0, marginBottom: "5px", fontSize: "0.8rem" }}><i>{formatDate(activity.eventDate)}</i></p>
                }
              </IonCard>
            </FadeIn>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default CarouselRecentlyViewed;