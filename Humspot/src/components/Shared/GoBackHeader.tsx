import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { chevronBackOutline } from "ionicons/icons";

type GoBackHeaderProps = {
  title: string;
}

const GoBackHeader: React.FC<GoBackHeaderProps> = (props: GoBackHeaderProps) => {

  const title = props.title || '';
  const router = useIonRouter();

  return (
    <IonHeader className='ion-no-border'>
      <IonToolbar style={{ '--background': '--ion-background-color' }}>
        <IonTitle style={{ fontSize: "1.25rem" }}>{title}</IonTitle>
        <IonButtons >
          <IonButton style={{ fontSize: '1.15em', marginLeft: '5px' }} onClick={() => { router.goBack(); }}>
            <p>Back</p>
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  )

};

export default GoBackHeader;