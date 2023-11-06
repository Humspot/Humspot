// Admin Main Page
// Should be an easy way for Admins to navigate different admin functions

import { IonContent, IonButtons, IonButton, IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";

import {useContext} from "../utils/my-context";

import ProfileHeader from "../components/Profile/ProfileHeader";
import AdminBio from "../components/Admin/AdminBio";
import SubmissionApproval from "../components/Admin/submissionApproval";


const adminMain: React.FC = () => {
    const context = useContext();
    const router = useIonRouter();
    
    return(
        <IonPage>
            <ProfileHeader />
            <AdminBio /> 
            <IonContent>
                <SubmissionApproval />
            </IonContent>


        </IonPage>
    )
} 
export default adminMain;