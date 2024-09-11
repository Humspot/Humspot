// Admins way of navigating their pending lists 
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonContent,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonTitle,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import useContext from "../../utils/hooks/useContext";
import { handleGetApprovedOrganizerSubmissions, handleGetPendingActivitySubmissions, handleGetPendingOrganizerSubmissions } from "../../utils/server";
import AdminSubmissionsList from "./AdminSubmissionsList";
import AdminPendingOrganizersList from "./AdminPendingOrganizersList";
import AdminApprovedOrganizersList from "./AdminApprovedOrganizersList";

const AdminSegment: React.FC = () => {

  const context = useContext();

  const [selectedSegment, setSelectedSegment] = useState<string>("pendingActivities");

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);

  const [organizers, setOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState<boolean>(false);

  const [approvedOrganizers, setApprovedOrganizers] = useState<{ username: string, userID: string }[]>([]);
  const [approvedOrganizersLoading, setApprovedOrganizersLoading] = useState<boolean>(false);

  const fetchSubmissions = useCallback(async () => {
    if (!context.humspotUser) return;
    setSubmissionsLoading(true);
    const response = await handleGetPendingActivitySubmissions(
      1,
      context.humspotUser.userID
    );
    setSubmissions(response.pendingSubmissions);
    setSubmissionsLoading(false);
  }, [context.humspotUser]);
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const fetchOrganizerSubmissions = useCallback(async () => {
    if (!context.humspotUser) return;
    setOrganizersLoading(true);
    const res = await handleGetPendingOrganizerSubmissions(1, context.humspotUser.userID);
    setOrganizers(res.pendingOrganizers);
    setOrganizersLoading(false);
  }, [context.humspotUser]);
  useEffect(() => {
    fetchOrganizerSubmissions();
  }, [fetchOrganizerSubmissions]);

  const fetchApprovedOrganizers = useCallback(async () => {
    if (!context.humspotUser) return;
    setApprovedOrganizersLoading(true);
    const res = await handleGetApprovedOrganizerSubmissions(1, context.humspotUser.userID);
    setApprovedOrganizers(res.organizerList);
    setApprovedOrganizersLoading(false);
  }, []);
  useEffect(() => {
    fetchApprovedOrganizers();
  }, [fetchApprovedOrganizers])

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchSubmissions();
    await fetchOrganizerSubmissions();
    await fetchApprovedOrganizers();
    event.detail.complete();
  }

  return (
    <>
      <div style={{ marginLeft: "2.5%", marginRight: "2.5%", marginTop: '10px', backgroundColor: "var(--ion-background-color)" }}>
        <IonSegment
          scrollable
          id="admin-segment"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
        >
          <IonSegmentButton value="pendingActivities">
            <div style={{ fontSize: "0.8rem" }}>
              <IonLabel>Pending Activities</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="pendingOrganizer">
            <div style={{ fontSize: "0.8rem" }}>
              <IonLabel>Pending Organizers</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="approvedOrganizer">
            <div style={{ fontSize: "0.8rem" }}>
              <IonLabel>Approved Organizers</IonLabel>
            </div>
          </IonSegmentButton>

        </IonSegment>
      </div>


      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {selectedSegment === "pendingActivities" ?
          <>
            {
              !submissionsLoading && submissions.length <= 0 ?
                <>
                  <IonTitle className="ion-text-center" style={{ display: "flex", height: "75%" }}>No Submissions</IonTitle>
                  <IonTitle className="ion-text-center" style={{ display: "flex", height: "82.5%", whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: '500' }}>Swipe down to reload</IonTitle>
                </>
                :
                <IonCard style={{ marginBottom: '2.5vh', marginTop: '10px', marginLeft: '2.5%', marginRight: '2.5%' }}>
                  <AdminSubmissionsList submissions={submissions} loading={submissionsLoading} />
                </IonCard>
            }
          </>
          : selectedSegment === "pendingOrganizer" ?
            <>
              {!organizersLoading && organizers.length <= 0 ?
                <>
                  <IonTitle className="ion-text-center" style={{ display: "flex", height: "75%" }}>No Requests</IonTitle>
                  <IonTitle className="ion-text-center" style={{ display: "flex", height: "82.5%", whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: '500' }}>Swipe down to reload</IonTitle>
                </>
                :
                <IonCard style={{ marginBottom: '2.5vh', marginTop: '10px', marginLeft: '2.5%', marginRight: '2.5%' }}>
                  <AdminPendingOrganizersList organizers={organizers} setOrganizers={setOrganizers} loading={organizersLoading} />
                </IonCard>
              }
            </>
            : selectedSegment === "approvedOrganizer" ? (
              <IonCard style={{ marginBottom: '2.5vh', marginTop: '10px', marginLeft: '2.5%', marginRight: '2.5%' }}>
                <AdminApprovedOrganizersList approvedOrganizers={approvedOrganizers} loading={approvedOrganizersLoading} />
              </IonCard>
            ) : (
              <></>
            )
        }
      </IonContent>
    </>
  )
};

export default AdminSegment