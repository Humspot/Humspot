// Should open a submission page with the info stuff 

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonLabel } from '@ionic/react';

const SubmissionDetailPage: React.FC<any> = ({ match }) => {
  const { submissionID } = match.params;

  // Fetch submission details based on submissionID, if needed

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/submissions" />
          </IonButtons>
          <IonLabel>Submission Details</IonLabel>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Render submission details here */}
        <h2>Submission ID: {submissionID}</h2>
        {/* Other details go here */}
      </IonContent>
    </IonPage>
  );
};

export default SubmissionDetailPage;
