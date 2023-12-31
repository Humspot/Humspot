import { IonButton, IonCard, IonCardTitle, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItemDivider, IonLabel, IonList, IonSkeletonText, IonTitle, useIonRouter } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { colorPalette, colorPaletteOutline, fastFood, fastFoodOutline, fitness, fitnessOutline, football, footballOutline, globe, globeOutline, laptop, laptopOutline, musicalNotes, partlySunny, partlySunnyOutline, school, schoolOutline } from "ionicons/icons";
import { musicalNotesOutline } from "ionicons/icons";
import { useState, useCallback, useEffect } from "react";
import { handleGetActivitiesGivenTag } from "../../utils/server";

import school_placeholder from '../../assets/images/school_placeholder.jpeg';
import placeholder from '../../assets/images/school_placeholder.jpeg';
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../../utils/formatDate";
import { useContext } from "../../utils/my-context";


const MAIN_FILTERS = [
  {
    name: "School",
    icon: school,
    iconOutline: schoolOutline
  },
  {
    name: "Music",
    icon: musicalNotes,
    iconOutline: musicalNotesOutline
  },
  {
    name: "Food",
    icon: fastFood,
    iconOutline: fastFoodOutline
  },
  {
    name: "Outdoor",
    icon: partlySunny,
    iconOutline: partlySunnyOutline,
  },
  {
    name: "Fitness",
    icon: fitness,
    iconOutline: fitnessOutline
  },
  {
    name: "Art",
    icon: colorPalette,
    iconOutline: colorPaletteOutline,
  },
  {
    name: "Tech",
    icon: laptop,
    iconOutline: laptopOutline,
  },
  {
    name: "Culture",
    icon: globe,
    iconOutline: globeOutline,
  },
  {
    name: "Sports",
    icon: football,
    iconOutline: footballOutline
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
      <div style={filter && !loadingFiltersActivities ? { position: 'sticky', top: 0, zIndex: 1000, padding: "10px 0", background: "var(--ion-background-color)" } : { padding: "10px 0" }}>
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
                    <IonIcon
                      icon={filter === entry.name ? entry.icon : entry.iconOutline}
                      color={filter === entry.name ? "secondary" : ""}
                      size="large"
                    ></IonIcon>
                    <IonLabel style={{ fontSize: "0.7rem" }} color={filter === entry.name ? "secondary" : ""}>{entry.name}</IonLabel>
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
                            src={activity.photoUrl ? activity.photoUrl : (filter === "School" ? school_placeholder : placeholder)}
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
                <div style={{ paddingTop: "25px", paddingBottom: "25px", background: "var(--ion-color-dark)" }}>
                  <FadeIn>
                    <IonTitle className="ion-text-center" style={{ display: "flex", height: "100%" }}>No Events Matching Filter</IonTitle>
                  </FadeIn>
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