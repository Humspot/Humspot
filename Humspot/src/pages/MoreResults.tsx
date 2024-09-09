/**
 * @file MoreResults.tsx
 * @fileoverview Displays a vertical list with results corresponding to the :tagName 
 */

import { useCallback, useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard, IonCardTitle, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
  IonPage, IonSkeletonText, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useToast } from "@agney/ir-toast";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

import { formatDate } from "../utils/functions/formatDate";
import { handleGetActivitiesGivenTag } from "../utils/server";

import placeholder from '../assets/images/placeholder.png';
import { chevronBackOutline, shareSocialOutline } from "ionicons/icons";
import { useContext } from "../utils/hooks/useContext";
import { handleShare } from "../utils/functions/handleShare";

type MoreResultsParams = {
  tagName: string;
};

const titleToTagName: Record<string, string> = {
  'Highlights': 'Highlight',
  'Adventure': 'Adventure',
  'Chill Places': 'Chill',
  '': '',
};

const MoreResults = () => {

  const params = useParams<MoreResultsParams>();
  const tagName: string = titleToTagName[decodeURIComponent(params.tagName)] ?? decodeURIComponent(params.tagName) ?? '';
  const Toast = useToast();
  const router = useIonRouter();
  const context = useContext();

  const [loadingFiltersActivities, setLoadingFiltersActivities] = useState<boolean>(false);
  const [filteredActivities, setFilteredActivities] = useState<any[]>();

  const [filterPageNum, setFilterPageNum] = useState<number>(2);

  const handleGetFilteredActivities = useCallback(async () => {
    if (!tagName) {
      setFilterPageNum(2);
      const t = Toast.create({ message: "No events for " + tagName, position: 'bottom', duration: 2000, color: "danger" });
      t.present();
      return;
    }
    setLoadingFiltersActivities(true);
    const res = await handleGetActivitiesGivenTag(1, tagName);
    setFilteredActivities(res.activities);
    setLoadingFiltersActivities(false);
  }, [tagName]);

  useEffect(() => {
    handleGetFilteredActivities();
  }, [handleGetFilteredActivities]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border' translucent={false}>
        <IonToolbar style={{ '--background': 'var(--ion-tab-bar-background)' }}>
          <IonButtons >
            <IonButton style={{ fontSize: '1.15em', marginRight: '15px' }} onClick={() => { router.goBack(); }}>
              <IonIcon color='primary' icon={chevronBackOutline} />
            </IonButton>
            <p style={{ fontSize: "1.25rem" }}>{tagName}</p>
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton style={{ fontSize: '1rem' }} onClick={async () => await handleShare('Check out activities tagged with ' + tagName + ' on Humspot!')}>
              <IonIcon color='primary' icon={shareSocialOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <>
          {
            tagName ?
              <>
                {
                  loadingFiltersActivities ?
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
                                    src={activity.photoUrls ? activity.photoUrls.trim().split(',')[0] : placeholder}
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
                            const response = await handleGetActivitiesGivenTag(filterPageNum, tagName);
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


      </IonContent>
    </IonPage>
  )
};

export default MoreResults;