import { IonCheckbox, IonContent, IonDatetime, IonItem, IonLabel, IonList, IonModal } from "@ionic/react";
import { useState } from "react";

type MapSettingsModalProps = {
  showThisWeeksEvents: boolean;
  setShowThisWeeksEvents: React.Dispatch<React.SetStateAction<boolean>>
};

const MapSettingsModal = (props: MapSettingsModalProps) => {

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // const handleUpdate

  return (
    <IonModal trigger="map-settings-modal" handle={false} breakpoints={[0, 0.85, 0.99]} initialBreakpoint={0.85}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>

        <IonList lines="none">
          <IonCheckbox>Top Attractions</IonCheckbox>
        </IonList>

        <IonList lines="none">
          <IonCheckbox checked={props.showThisWeeksEvents} onIonChange={(e) => { props.setShowThisWeeksEvents(e.detail.checked) }}>Events within the week</IonCheckbox>
        </IonList>

        <div>
          <IonLabel>Start Date</IonLabel>
          <input type='date' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setStartDate(e.target.value) }} />
        </div>

        <div>
          <IonLabel>End Date</IonLabel>
          <input type='date' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEndDate(e.target.value) }} />
        </div>

      </IonContent>
    </IonModal>
  );
};


export default MapSettingsModal;