import { IonButton, IonCard, IonCardTitle, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonSkeletonText, IonText, IonTitle, useIonRouter } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { football, globe, laptop } from "ionicons/icons";
import { useState, useCallback, useEffect } from "react";
import { handleGetActivitiesGivenTag } from "../../utils/server";

import school_placeholder from '../../assets/images/school_placeholder.jpeg';
import placeholder from '../../assets/images/school_placeholder.jpeg';
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/formatDate";
import { useContext } from "../../utils/my-context";

import school_icon from '../../assets/icons/school_icon.png';
import food_icon_unselected from '../../assets/icons/food_icon.png';
import music_icon from '../../assets/icons/music_icon.gif';
import music_icon_unselected from '../../assets/icons/music_icon.png';
import outdoor_icon from '../../assets/icons/outdoor_icon.gif';
import outdoor_icon_unselected from '../../assets/icons/outdoor_icon.png';
import fitness_icon from '../../assets/icons/fitness_icon.gif';
import fitness_icon_unselected from '../../assets/icons/fitness_icon.png';
import art_icon from '../../assets/icons/art_icon.gif';
import art_icon_unselected from '../../assets/icons/art_icon.png';
import tech_icon from '../../assets/icons/tech_icon.gif';
import tech_icon_unselected from '../../assets/icons/tech_icon.png';
import culture_icon from '../../assets/icons/culture_icon.gif';
import culture_icon_unselected from '../../assets/icons/culture_icon.png';
import sports_icon from '../../assets/icons/sports_icon.gif';
import sports_icon_unselected from '../../assets/icons/sports_icon.png';

const MAIN_FILTERS: { name: string; icon: string; iconUnselected: string; }[] = [
  {
    name: "School",
    icon: school_icon,
    iconUnselected: school_icon
  },
  {
    name: "Music",
    icon: music_icon,
    iconUnselected: music_icon_unselected
  },
  {
    name: "Food",
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Foods_-_Idil_Keysan_-_Wikimedia_Giphy_stickers_2019.gif',
    iconUnselected: food_icon_unselected
  },
  {
    name: "Outdoor",
    icon: outdoor_icon,
    iconUnselected: outdoor_icon_unselected
  },
  {
    name: "Fitness",
    icon: fitness_icon,
    iconUnselected: fitness_icon_unselected
  },
  {
    name: "Art",
    icon: art_icon,
    iconUnselected: art_icon_unselected
  },
  {
    name: "Tech",
    icon: tech_icon,
    iconUnselected: tech_icon_unselected
  },
  {
    name: "Culture",
    icon: culture_icon,
    iconUnselected: culture_icon_unselected
  },
  {
    name: "Sports",
    icon: sports_icon,
    iconUnselected: sports_icon_unselected
  },
];

const ExploreFilterButtons = (props: { setShowFilterList: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const context = useContext();
  const router = useIonRouter();

  const [filter, setFilter] = useState<string>('');
  const [loadingFiltersActivities, setLoadingFiltersActivities] = useState<boolean>(false);
  const [filteredActivities, setFilteredActivities] = useState<any[]>();

  const [filterPageNum, setFilterPageNum] = useState<number>(2);

  const handleGetFilteredActivities = useCallback(async () => {
    if (!filter) {
      props.setShowFilterList(false);
      setFilterPageNum(2);
      return;
    }
    setLoadingFiltersActivities(true);
    props.setShowFilterList(true);
    const res = await handleGetActivitiesGivenTag(1, filter);
    setFilteredActivities(res.activities);
    setLoadingFiltersActivities(false);
  }, [filter]);

  useEffect(() => {
    handleGetFilteredActivities();
  }, [handleGetFilteredActivities]);

  return (
    <>
      <div style={filter && !loadingFiltersActivities ? { position: 'sticky', top: 0, zIndex: 1000, padding: "0 0", marginTop: "0", background: "var(--ion-background-color)" } : { marginTop: "0", padding: "0 0" }}>
        <Swiper slidesPerView={5.5} spaceBetween={-20}>
          {MAIN_FILTERS.map((entry, idx) => {
            return (
              <SwiperSlide key={idx}>
                <IonButton
                  style={{ '--ripple-color': 'transparent' }}
                  fill="clear"
                  color="light"
                  onClick={() => {
                    setFilter((prev) => prev === entry.name ? '' : entry.name);
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={filter === entry.name ? entry.icon : entry.iconUnselected ?? ''} />
                    <IonLabel style={{ fontSize: "0.7rem" }} color={filter === entry.name ? "secondary" : "dark"}>{entry.name}</IonLabel>
                  </div>
                </IonButton>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      {filter ?
        <>
          {loadingFiltersActivities ?
            <>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{ height: "200px", borderRadius: "5px" }} animated />
                  {/* <br /> */}
                  <IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{ height: "200px", borderRadius: "5px" }} animated />
                  {/* <br /> */}
                  <IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{ height: "200px", borderRadius: "5px" }} animated />
                  {/* <br /> */}
                  <IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{ height: "200px", borderRadius: "5px" }} animated />
                  {/* <br /> */}
                  <IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
            </>
            :
            filteredActivities && filteredActivities.length > 0 ?
              <>
                {filteredActivities.map((activity, idx: number) => {
                  return (
                    <FadeIn key={idx} delay={(idx % 20) * 50}>
                      <IonCard style={{ '--background': 'var(--ion-background-color)', paddingLeft: "5px", paddingRight: "5px" }} onClick={() => { if ("activityID" in activity && activity.activityID) router.push("/activity/" + activity.activityID) }}>
                        <div style={{ height: '175px', overflow: 'hidden', borderRadius: "5px" }}>
                          <img
                            src={activity.photoUrls ? activity.photoUrls.trim().split(',')[0] : (filter === "School" ? school_placeholder : placeholder)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <IonCardTitle style={{ marginTop: "5px", fontSize: "1.35rem" }}>{activity.name}</IonCardTitle>
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
                  )
                })}
                <IonInfiniteScroll
                  onIonInfinite={async (ev) => {
                    const response = await handleGetActivitiesGivenTag(filterPageNum, filter);
                    if (response.success) {
                      setFilterPageNum((prev) => prev + 1);
                      setFilteredActivities((prev) => [...(prev as any[]), ...(response.activities as any[])]);
                    }
                    ev.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </>
              :
              !loadingFiltersActivities ?
                <div style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                  <IonTitle className="ion-text-center" style={{ display: "flex", height: "110%", background: "var(--ion-background-color)" }}><IonText color='dark'>No Events Matching Filter</IonText></IonTitle>
                </div>
                :
                <></>
          }
        </>
        :
        <></>
      }
    </>
  )

};

export default ExploreFilterButtons;