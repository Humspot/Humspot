// Admin Main Page
// Should be an easy way for Admins to navigate different admin functions

import { IonContent, IonButtons, IonButton, IonPage, useIonRouter, useIonViewWillEnter, IonTitle } from "@ionic/react";

import {useContext} from "../utils/my-context";
import { useEffect } from "react";
import { timeout } from "../utils/timeout";

import ProfileHeader from "../components/Profile/ProfileHeader";
import AdminBio from "../components/Admin/AdminBio";
import AdminSegment from "../components/Admin/adminSegments";
import SubmissionApproval from "../components/Admin/submissionApproval";
import OrganizersApproval from "../components/Admin/organizerApproval";


const adminMain: React.FC = () => {
    const context = useContext();
    const router = useIonRouter();
    
    return(
        <IonPage>
            <IonContent>
                {context.humspotUser?.accountType =='admin' ?
                <>
                    <ProfileHeader />
                    <AdminBio /> 
                    <AdminSegment />
                    </>
            : <IonTitle>Not an admin</IonTitle>}
            </IonContent>
        </IonPage>
    )
} 
export default adminMain;