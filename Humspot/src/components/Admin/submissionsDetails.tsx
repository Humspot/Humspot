// Should open a submission page with the info stuff 

import React, { useState, useEffect } from 'react';
import { IonPage, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonContent, 
    IonLabel 
} from '@ionic/react';

import { useHistory } from 'react-router-dom';


const SubmissionDetailPage: React.FC<any> = ({ match }) => {
  const { submissionID } = match.params;
  const history = useHistory(); 
  const [submissionDetails, setSubmissionDetails] = useState<any>({});

  const handleBackButtonClick = () => {
    history.push('/admin-dashboard');
  };
  
  useEffect(() => {
    // Fetch submission details based on submissionID
    // Replace the following with your actual API call
    const fetchSubmissionDetails = async () => {
      try {
        // Example API call using fetch
        const response = await fetch(`/api/submissions/${submissionID}`);
        const data = await response.json();
        setSubmissionDetails(data);
      } catch (error) {
        console.error('Error fetching submission details:', error);
      }
    };     
    fetchSubmissionDetails();
  }, [submissionID]);

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
        <h2>Submission ID: {submissionID}</h2>
        {/* Other details go here */}
      </IonContent>
    </IonPage>
  );
};

export default SubmissionDetailPage;
