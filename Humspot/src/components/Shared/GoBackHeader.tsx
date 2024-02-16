import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { chevronBackOutline } from "ionicons/icons";

type GoBackHeaderProps = {
  title: string;
  buttons?: any;
  translucent?: boolean;
};

const GoBackHeader: React.FC<GoBackHeaderProps> = (props: GoBackHeaderProps) => {

  const title = props.title || '';
  const router = useIonRouter();

  return (
    <IonHeader className='ion-no-border' translucent={false}>
      <IonToolbar style={{ '--background': 'var(--ion-tab-bar-background)' }}>
        <IonButtons >
          <IonButton style={{ fontSize: '1.15em', marginRight: '15px' }} onClick={() => { router.goBack(); }}>
            <IonIcon color='primary' icon={chevronBackOutline} />
          </IonButton>
          <p style={{ fontSize: "1.25rem" }}>{title}</p>
          {/* <IonTitle>{title}</IonTitle> */}
        </IonButtons>
        {props.buttons &&
          <IonButtons slot="end">
            {props.buttons}
          </IonButtons>
        }
      </IonToolbar>
    </IonHeader>

  )

};

export default GoBackHeader;