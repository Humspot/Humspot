import { IonContent, IonItem, IonLabel, IonList, IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import { useContext } from "../utils/my-context";
import { useCallback, useEffect, useState } from "react";
import { navigateBack } from "../components/Shared/BackButtonNavigation";
import { handleGetSubmittedActivities } from "../utils/server";
import { SubmittedActivities } from "../utils/types";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { extractDateFromSqlDatetime } from "../utils/formatDate";



const SubmittedActivitiesPage = () => {

  const context = useContext();
  const router = useIonRouter();

  const [submittedActivities, setSubmittedActivities] = useState<SubmittedActivities[]>([]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, () => {
        navigateBack(router, false);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

  const fetchSubmittedActivities = useCallback(async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;
    const res = await handleGetSubmittedActivities(context.humspotUser.userID, 1);
    setSubmittedActivities(res.submittedActivities)
  }, [context.humspotUser])

  useEffect(() => {
    fetchSubmittedActivities();
  }, [fetchSubmittedActivities])

  return (
    <IonPage>
      <GoBackHeader title="Submitted Activities" />

      <IonContent>
        <IonList>
          {submittedActivities && submittedActivities.map((activity, index: number) => {
            return (
              <IonItem button key={index} onClick={() => { }}>
                <IonLabel style={{ paddingLeft: "10px" }}>
                  <h1 style={{ fontSize: "1.2rem" }}><b>{activity.name}</b> - {activity.activityType.toUpperCase()}</h1>
                  <p style={{ fontSize: "1.05rem" }}>{activity.description}</p>
                  <p style={{ fontSize: "0.9rem" }}>Submitted on {extractDateFromSqlDatetime(activity.submissionDate)}</p>
                </IonLabel>
              </IonItem>
            )
          })}
        </IonList>

      </IonContent>
    </IonPage>
  )

};

export default SubmittedActivitiesPage;