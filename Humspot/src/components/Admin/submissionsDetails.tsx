// Should open a submission page with the info stuff 

import React, { useState, useEffect, useCallback } from 'react';
import { IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonContent, 
    IonLabel 
} from '@ionic/react';

import { useHistory } from 'react-router-dom';
import { handleGetPendingActivitySubmissions } from '../../utils/server';


const SubmissionDetailPage: React.FC<any> = ({ match }) => {
  const { submissionID } = match.params;
  const history = useHistory(); 
  const [submissionDetails, setSubmissionDetails] = useState<any>({});

  const handleBackButtonClick = () => {
    history.push('/admin-dashboard');
  };

  const fetchSubmissionsDetails = useCallback(async () => {
    //Assume handleGetSubmissionsDetails
    try {
      const details = await handleGetPendingActivitySubmissions(submissionDetails);
      setSubmissionDetails(details);
    } catch (error) {
      console.error('Error fetching submission details:', error);
    }
  }, [ submissionID ]);

  useEffect (()=> {
    fetchSubmissionsDetails();
  }, [fetchSubmissionsDetails]);
  

  // Fetch submission details based on submissionID, if needed

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton onClick={handleBackButtonClick} />
          </IonButtons>
          <IonLabel>Submission List</IonLabel>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Render submission details here */}
        <h2>Submission ID: { submissionID } </h2>
        <h3>Event Name: { submissionID } </h3>
        {/* Other details go here */}
      </IonContent>
    </IonPage>
  );
};

export default SubmissionDetailPage;
