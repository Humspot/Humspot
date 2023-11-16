import { IonCheckbox, IonContent, IonList, IonModal } from "@ionic/react";

type MapSettingsModalProps = {
  showThisWeeksEvents: boolean;
  setShowThisWeeksEvents: React.Dispatch<React.SetStateAction<boolean>>
};

const MapSettingsModal = (props: MapSettingsModalProps) => {

  return (
    <IonModal trigger="map-settings-modal" handle={false} breakpoints={[0, 0.85, 0.99]} initialBreakpoint={0.85}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>

        <IonList lines="none">
          <IonCheckbox>Top Attractions</IonCheckbox>
        </IonList>

        <IonList lines="none">
          <IonCheckbox checked={props.showThisWeeksEvents} onIonChange={(e) => { props.setShowThisWeeksEvents(e.detail.checked) }}>Events within the week</IonCheckbox>
        </IonList>

      </IonContent>
    </IonModal>
  );
};


export default MapSettingsModal;