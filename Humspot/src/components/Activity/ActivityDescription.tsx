import { IonCard, IonCardContent, IonText } from '@ionic/react';

type ActivityDescriptionProps = {
  description: string;
  websiteURL: string;
};

const ActivityDescription = (props: ActivityDescriptionProps) => {

  const description: string = props.description || '';
  const websiteURL: string = props.websiteURL || '';

  return (
    <IonCard>
      <IonCardContent>
        <IonText>
          <p>{description ?? ''}</p>
          <br />
          <p>
            <a
              href={websiteURL ?? ''}
              rel='noopener noreferrer'
            >
              Visit Site
            </a>
          </p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityDescription;