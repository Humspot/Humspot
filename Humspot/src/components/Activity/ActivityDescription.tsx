import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';

type ActivityDescriptionProps = {
  description: string;
  websiteURL: string;
};

const ActivityDescription = (props: ActivityDescriptionProps) => {

  const description: string = props.description || '';
  const websiteURL: string = props.websiteURL || '';

  return (
    <IonCard className='activity-card'>
      <IonCardContent>
        <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingBottom: "10px" }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Description</IonCardTitle>
        </IonCardHeader>
        {description && <p>{description}</p>}
        {websiteURL && <p> <a href={websiteURL ?? ''} target='_blank' rel='noopener noreferrer'> Visit Site </a> </p>}
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityDescription;