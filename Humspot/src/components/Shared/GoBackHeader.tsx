import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { chevronBackOutline } from "ionicons/icons";

type GoBackHeaderProps = {
  title: string;
  buttons?: any;
};

const GoBackHeader: React.FC<GoBackHeaderProps> = (props: GoBackHeaderProps) => {

  const title = props.title || '';
  const router = useIonRouter();

  return (
    <IonHeader className='ion-no-border'>
      <IonToolbar style={{ '--background': 'var(--ion-tab-bar-background)' }}>
        <IonButtons >
          <IonButton color='secondary' style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { router.goBack(); }}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>{title}</IonTitle>
          {props.buttons}
        </IonButtons>
      </IonToolbar>
    </IonHeader>

  )

};

export default GoBackHeader;