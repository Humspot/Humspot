import { IonContent, IonItem, IonLabel, IonList, IonPage, IonTitle, useIonViewWillEnter } from "@ionic/react";
import { useContext } from "../utils/hooks/useContext";
import { useCallback, useEffect, useState } from "react";
import { handleGetSubmittedActivities } from "../utils/server";
import { SubmittedActivities } from "../utils/types";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { extractDateFromSqlDatetime } from "../utils/functions/formatDate";
import SkeletonLoading from "../components/Shared/SkeletonLoading";


const SubmittedActivitiesPage = () => {

  const context = useContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [submittedActivities, setSubmittedActivities] = useState<SubmittedActivities[]>([]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  const fetchSubmittedActivities = useCallback(async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;
    setLoading(true);
    const res = await handleGetSubmittedActivities(context.humspotUser.userID, 1);
    setSubmittedActivities(res.submittedActivities)
    setLoading(false);
  }, [context.humspotUser])

  useEffect(() => {
    fetchSubmittedActivities();
  }, [fetchSubmittedActivities])

  return (
    <IonPage>
      <GoBackHeader title="Submitted Activities" />

      <IonContent>

        <IonList className='ion-no-padding' lines="full">
          {loading ?
            <SkeletonLoading count={6} height={"5rem"} animated={true} />
            :
            submittedActivities ? submittedActivities.map((activity, index: number) => {
              return (
                <IonItem button key={index} onClick={() => { }}>
                  <IonLabel style={{ paddingLeft: "10px" }}>
                    <h1 style={{ fontSize: "1.2rem" }}>{activity.activityType.toUpperCase()} - <b>{activity.name}</b></h1>
                    <p style={{ fontSize: "1.05rem" }}>{activity.description}</p>
                    <p style={{ fontSize: "0.9rem" }}>Submitted on {extractDateFromSqlDatetime(activity.submissionDate)}</p>
                  </IonLabel>
                </IonItem>
              )
            })
              :
              <></>
          }
        </IonList>

        {!loading && (!submittedActivities || submittedActivities.length <= 0) &&
          <IonTitle className="ion-text-center" style={{ display: "flex", height: "90%" }}>No Pending Submissions</IonTitle>
        }

      </IonContent>
    </IonPage>
  )

};

export default SubmittedActivitiesPage;