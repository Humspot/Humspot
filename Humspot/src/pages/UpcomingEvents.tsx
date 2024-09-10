import { useCallback, useEffect, useState } from "react";
import { useContext } from "../utils/hooks/useContext";
import { handleGetThisWeeksEvents } from "../utils/server";
import { IonButton, IonButtons, IonCard, IonCardTitle, IonContent, IonHeader, IonIcon, IonPage, IonSkeletonText, IonTitle, IonToolbar, useIonRouter, useIonToast, useIonViewWillEnter } from "@ionic/react";
import { GetHumspotEventResponse } from "../utils/types";
import { chevronBackOutline, shareOutline, shareSocialOutline } from "ionicons/icons";
import { handleShare } from "../utils/functions/handleShare";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { formatDate } from "../utils/functions/formatDate";
import useIonBackButton from "../utils/hooks/useIonBackButton";


const UpcomingEvents = () => {

  const context = useContext();
  const [presentToast] = useIonToast();
  const router = useIonRouter();

  const [events, setEvents] = useState<GetHumspotEventResponse[] | null>(null);
  
  useIonBackButton(50, () => { router.goBack(); }, [router]);

  const handleGetUpcomingEvents = useCallback(async () => {
    // if (context.humspotUser) {
    const res = await handleGetThisWeeksEvents();
    if (res.success) {
      setEvents(res.events);
    } else {
      presentToast({ message: res.message, color: 'danger', duration: 2000 });
    }
    // }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useEffect(() => {
    handleGetUpcomingEvents();
  }, [handleGetUpcomingEvents]);

  return (
    <IonPage>
      <IonHeader className='ion-no-border' translucent={false}>
        <IonToolbar style={{ '--background': 'var(--ion-tab-bar-background)' }}>
          <IonButtons >
            <IonButton style={{ fontSize: '1.15em', marginRight: '15px' }} onClick={() => { router.goBack(); }}>
              <IonIcon color='primary' icon={chevronBackOutline} />
            </IonButton>
            <p style={{ fontSize: "1.25rem" }}>Upcoming Events</p>
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton style={{ fontSize: '1rem' }} onClick={async () => await handleShare('Check out these upcoming events on Humspot!')}>
              <IonIcon color='primary' icon={shareSocialOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" style={{ paddingLeft: '17.5px' }}>Upcoming</IonTitle>
          </IonToolbar>
        </IonHeader>
        <>
          {events === null &&
            <>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{
                    height: "200px", borderRadius: "5px"
                  }} animated />
                  < IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{
                    height: "200px", borderRadius: "5px"
                  }} animated />
                  < IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{
                    height: "200px", borderRadius: "5px"
                  }} animated />
                  < IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
              <IonCard style={{ '--background': 'var(--ion-background-color)' }}>
                <div style={{ padding: "5px" }}>
                  <IonSkeletonText style={{
                    height: "200px", borderRadius: "5px"
                  }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "75vw", borderRadius: "5px" }} animated />
                  <IonSkeletonText style={{ height: "20px", width: "50vw", borderRadius: "5px" }} animated />
                </div>
              </IonCard>
            </>
          }
          {events && events.map((activity, idx: number) => {
            return (
              <FadeIn key={idx} delay={(idx % 20) * 50}>
                <IonCard style={{ '--background': 'var(--ion-background-color)', paddingLeft: "5px", paddingRight: "5px" }} onClick={() => { if ("activityID" in activity && activity.activityID) router.push("/activity/" + activity.activityID) }}>
                  <div style={{
                    height: '175px', overflow: 'hidden', borderRadius: "5px"
                  }}>
                    <img src={activity.photoUrl || ""} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  {"date" in activity && activity.date &&
                    <p style={{ marginTop: 0, marginBottom: "5px", fontSize: "0.8rem" }}><i>{formatDate(activity.date)}</i></p>
                  }
                </IonCard>
              </FadeIn>
            )
          })}
        </>
      </IonContent>
    </IonPage>
  )

};

export default UpcomingEvents;