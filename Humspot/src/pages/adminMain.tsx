// Admin Main Page
// Should be an easy way for Admins to navigate different admin functions

import { IonContent, IonButtons, IonButton, IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";

import {useContext} from "../utils/my-context";


const adminMain: React.FC = () => {
    const context = useContext();
    const router = useIonRouter();
    
    return(
        <IonPage>
            <IonContent>
            <h1> Testing Admin Page </h1>
             </IonContent>
        </IonPage>
    )
} 
export default adminMain;