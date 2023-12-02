// Admins way of navigating their pending lists 
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonContent,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  addCircleOutline,
  personOutline,
  personAddOutline
} from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { useContext } from "../../utils/my-context";
import { handleGetApprovedOrganizerSubmissions, handleGetPendingActivitySubmissions, handleGetPendingOrganizerSubmissions } from "../../utils/server";
import AdminSubmissionsList from "./AdminSubmissionsList";
import AdminPendingOrganizersList from "./AdminPendingOrganizersList";
import AdminApprovedOrganizersList from "./AdminApprovedOrganizersList";

const AdminSegment: React.FC = () => {

  const context = useContext();

  const [selectedSegment, setSelectedSegment] = useState<string>("pendingActivities");

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);

  // List of pending requests to be an organizer
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [organizersLoading, setOrganizersLoading] = useState<boolean>(false);

  const [approvedOrganizers, setApprovedOrganizers] = useState<any[]>([]);
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
              <IonIcon
                icon={addCircleOutline}
                style={{ margin: "5%" }}
                size="large">
              </IonIcon>
              <IonLabel>Pending Activities</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="pendingOrganizer">
            <div className="segment-button" style={{ fontSize: "0.8rem" }}>
              <IonIcon
                icon={personAddOutline}
                style={{ margin: "5%" }}
                size="large">
              </IonIcon>
              <IonLabel>Pending Organizers</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="approvedOrganizer">
            <div className="segment-button" style={{ fontSize: "0.8rem" }}>
              <IonIcon
                icon={personOutline}
                style={{ margin: "5%" }}
                size="large">
              </IonIcon>
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
          <IonCard>
            <AdminSubmissionsList submissions={submissions} loading={submissionsLoading} />
          </IonCard>
        ) : selectedSegment === "pendingOrganizer" ? (
          <IonCard>
            <AdminPendingOrganizersList organizers={organizers} setOrganizers={setOrganizers} loading={organizersLoading} />
          </IonCard>
        ) : selectedSegment === "approvedOrganizer" ? (
          <IonCard>
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