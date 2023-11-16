import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { chevronBackOutline } from "ionicons/icons";
import ActivityFavoriteVisitedRSVPButton from "../Activity/ActivityFavoriteVisitedRSVPButton";

type GoBackHeaderProps = {
  title: string;
  buttons: any;
}

const GoBackHeader: React.FC<GoBackHeaderProps> = (props: GoBackHeaderProps) => {

  const title = props.title || '';
  const router = useIonRouter();

  return (
    <IonHeader className='ion-no-border'>
      <IonToolbar style={{ '--background': '--ion-background-color' }}>
        <IonButtons >
          <IonButton style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { router.goBack(); }}>
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