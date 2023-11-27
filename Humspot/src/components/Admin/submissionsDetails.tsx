// Should open a submission page with the info stuff 

import React, { useState, useEffect, useCallback } from 'react';
import { IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonContent, 
    IonLabel,  
    IonFooter,  
    IonRow
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

  const handleApprove = () => {
    console.log("Submission Approved");
  };
  
  const handleDecline = () => {
    console.log('Submissions Decline');
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
        <h4>Description: </h4> 
        <p> Test Description{ submissionID } </p>
        {/* Other details go here */}    
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonRow style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
            <IonButtons onClick={handleApprove} color="success">
              Approve
            </IonButtons>
          </IonRow>

          <IonRow>
            <IonButtons onClick={handleDecline} color="danger">
             Decline
            </IonButtons>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SubmissionDetailPage;
