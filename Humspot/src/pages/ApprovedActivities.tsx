import { IonContent, IonItem, IonLabel, IonList, IonPage, IonThumbnail, IonTitle, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import useContext from "../utils/hooks/useContext";
import { useCallback, useEffect, useState } from "react";
import { handleGetApprovedSubmissions } from "../utils/server";
import GoBackHeader from "../components/Shared/GoBackHeader";
import SkeletonLoading from "../components/Shared/SkeletonLoading";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import placeholder from '../assets/images/school_placeholder.jpeg';

const descriptionStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '0.9rem',
  whiteSpace: 'normal',
  lineHeight: '1.2em',
  height: '2.4em'
};

const ApprovedActivitiesPage = () => {

  const context = useContext();
  const router = useIonRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [approvedActivities, setApprovedActivities] = useState<{ description: string; name: string; activityID: string; image_url: string }[]>([]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  const fetchSubmittedActivities = useCallback(async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;
    setLoading(true);
    const res = await handleGetApprovedSubmissions(1, context.humspotUser.userID);
    setApprovedActivities(res.submissions);
    setLoading(false);
  }, [context.humspotUser])

  useEffect(() => {
    fetchSubmittedActivities();
  }, [fetchSubmittedActivities])

  return (
    <IonPage>
      <GoBackHeader translucent={true} title="Approved Submissions" />

      <IonContent>
        <br />

        <IonList className='ion-no-padding' lines="full">
          {loading ?
            <SkeletonLoading count={6} height={"5rem"} animated={true} />
            :
            approvedActivities ? approvedActivities.map((activity, index: number) => {
              return (
                <FadeIn key={activity.activityID + index} delay={(index % 20) * 50}>
                  <IonItem className='ion-no-padding' role='button' onClick={() => { if (activity.activityID) router.push("/activity/" + activity.activityID) }}>
                    <IonThumbnail style={{ marginLeft: "10px" }}><img style={{
                      borderRadius: "5px"
                    }} src={activity.image_url || placeholder} /></IonThumbnail>
                    <IonLabel style={{ paddingLeft: "10px" }
                    } >
                      <h2>{activity.name}</h2>
                      <p style={descriptionStyle}>{activity.description}</p>
                      {/* <p>{" "}&nbsp;</p> */}
                    </IonLabel>
                  </IonItem>
                </FadeIn>
              )
            })
              :
              <></>
          }
        </IonList>

        {!loading && (!approvedActivities || approvedActivities.length <= 0) &&
          <IonTitle className="ion-text-center" style={{ display: "flex", height: "90%" }}>No Approved Submissions</IonTitle>
        }

      </IonContent>
    </IonPage>
  )

};

export default ApprovedActivitiesPage;