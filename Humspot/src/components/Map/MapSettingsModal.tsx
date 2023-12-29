import { IonButton, IonButtons, IonCheckbox, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { canDismiss } from "../../utils/functions/canDismiss";
import { useContext } from "../../utils/hooks/useContext";
import { useToast } from "@agney/ir-toast";

type MapSettingsModalProps = {
  page: any;
  showThisWeeksEvents: boolean;
  setShowThisWeeksEvents: React.Dispatch<React.SetStateAction<boolean>>
  showTopAttractions: boolean;
  setShowTopAttractions: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapSettingsModal = (props: MapSettingsModalProps) => {

  const context = useContext();
  const Toast = useToast();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const handleDateDiff = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return diffTime / (1000 * 60 * 60 * 24);
  };

  const handleSelectDate = (newDate: string, isStartDate: boolean) => {
    const setDate = isStartDate ? setStartDate : setEndDate;
    const comparisonDate = isStartDate ? endDate : startDate;
    let isValid = true;

    if (comparisonDate) {
      const dateDiff = handleDateDiff(newDate, comparisonDate);
      isValid = dateDiff <= 14;
      if (isStartDate) {
        isValid = isValid && new Date(newDate) <= new Date(comparisonDate);
      } else {
        isValid = isValid && new Date(newDate) >= new Date(startDate);
      }
    }
    if (isValid) {
      setDate(newDate);
    } else {
      Toast.create({
        message: "Invalid date selection. Dates must be within two weeks and correctly ordered.",
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      }).present();
    }
  };

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page])

  return (
    <IonModal ref={modalRef} presentingElement={presentingElement} canDismiss={canDismiss} trigger="map-settings-modal" handle={false}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-toolbar'>
            <IonTitle className='profile-modal-title'>Map Settings</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => { modalRef.current?.dismiss() }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <section style={{ padding: "15px" }}>
          <IonList lines="none">
            <IonCheckbox slot='end' checked={props.showTopAttractions} onIonChange={(e) => { props.setShowTopAttractions(e.detail.checked) }}>Top Attractions</IonCheckbox>
          </IonList>
          <br />
          <IonList lines="none">
            <IonCheckbox checked={props.showThisWeeksEvents} onIonChange={(e) => { props.setShowThisWeeksEvents(e.detail.checked) }}>Events within the week</IonCheckbox>
          </IonList>
          <br />
          <br />
          <div>
            <IonLabel>Start Date</IonLabel>
            <IonInput style={context.darkMode ? { '--background': '#2d2d2d' } : { '--background': '#e1e1e1' }} type='date' value={startDate} onIonChange={(e) => handleSelectDate(e.detail.value as string, true)} />
          </div>
          <br />
          <div>
            <IonLabel>End Date</IonLabel>
            <IonInput style={context.darkMode ? { '--background': '#2d2d2d' } : { '--background': '#e1e1e1' }} type='date' value={endDate} onIonChange={(e) => handleSelectDate(e.detail.value as string, false)} />
          </div>
        </section>

      </IonContent>
    </IonModal>
  );
};


export default MapSettingsModal;