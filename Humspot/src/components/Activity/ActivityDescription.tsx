/**
 * @file ActivityDescription.tsx
 * @fileoverview the card that contains the activity description, including its open times and website url
 * if applicable.
 */

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';

type ActivityDescriptionProps = {
  description: string;
  websiteURL: string;
  openTimes: string | null;
};

const ActivityDescription = (props: ActivityDescriptionProps) => {

  const description: string = props.description || '';
  const websiteURL: string = props.websiteURL || '';
  const openTimes: string | null = props.openTimes || null;

  return (
    <IonCard className='activity-card'>
      <IonCardContent>
        <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingBottom: "10px" }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Description</IonCardTitle>
        </IonCardHeader>
        {openTimes && <><p>Open: {openTimes}</p> <br /></>}
        {description && <p>{description}</p>}
        {websiteURL && <p> <a href={websiteURL ?? ''} target='_blank' rel='noopener noreferrer'> Visit Site </a> </p>}
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityDescription;