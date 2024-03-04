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

  const [approvedOrganizers, setApprovedOrganizers] = useState<{ username: string }[]>([]);
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
      <div style={{ marginLeft: "2.5%", marginRight: "2.5%", backgroundColor: "var(--ion-background-color)" }}>
        <IonSegment
          scrollable
          // className="ion-justify-content-center"
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
        >
          <IonSegmentButton value="pendingActivities">
            <div className="segment-button" style={{ fontSize: "0.8rem" }}>
              <IonLabel>Pending Activities</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="pendingOrganizer">
            <div className="segment-button" style={{ fontSize: "0.8rem" }}>
              <IonLabel>Pending Organizers</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="approvedOrganizer">
            <div className="segment-button" style={{ fontSize: "0.8rem" }}>
              <IonLabel>Approved Organizers</IonLabel>
            </div>
          </IonSegmentButton>

        </IonSegment>
      </div>


      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {selectedSegment === "pendingActivities" ? (
          <IonCard style={{ marginBottom: '2.5vh' }}>
            <AdminSubmissionsList submissions={submissions} loading={submissionsLoading} />
          </IonCard>
        ) : selectedSegment === "pendingOrganizer" ? (
          <IonCard style={{ marginBottom: '2.5vh' }}>
            <AdminPendingOrganizersList organizers={organizers} setOrganizers={setOrganizers} loading={organizersLoading} />
          </IonCard>
        ) : selectedSegment === "approvedOrganizer" ? (
          <IonCard style={{ marginBottom: '2.5vh' }}>
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