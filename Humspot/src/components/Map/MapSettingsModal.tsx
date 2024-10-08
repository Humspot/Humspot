/**
 * @file MapSettingsModal.tsx
 * @fileoverview the modal that pops in on the map page when clicking the settings button. 
 * The modal contains options to filter the map pins based on a date range.
 */
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@agney/ir-toast";

import { useContext } from "../../utils/hooks/useContext";

import { handleGetEventsBetweenTwoDates } from "../../utils/server";
import { GetEventsBetweenTwoDatesStatusResponse } from "../../utils/types";

import './Map.css';

/**
 * @description checks whether two date strings are within a two week range.
 * 
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {boolean} whether the dates are in a range of two weeks or not.
 */
function areDatesWithinTwoWeeks(startDate: string, endDate: string): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const twoWeeks = 14 * oneDay;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMilliseconds = end.getTime() - start.getTime();

  return diffMilliseconds <= twoWeeks;
};

type MapSettingsModalProps = {
  page: any;
  showThisWeeksEvents: boolean;
  setShowThisWeeksEvents: React.Dispatch<React.SetStateAction<boolean>>
  showTopAttractions: boolean;
  setShowTopAttractions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEventsBetweenTwoDates: React.Dispatch<React.SetStateAction<boolean>>;
  setEventsBetweenTwoDates: React.Dispatch<React.SetStateAction<GetEventsBetweenTwoDatesStatusResponse['events'] | null>>;
};

const MapSettingsModal = (props: MapSettingsModalProps) => {

  const context = useContext();
  const Toast = useToast();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  /**
   * @description runs when users click the update button.
   * The start date is verified to be before the end date, and are then verified to be in a range of two weeks.
   * Once verified, the events on the Maps page is updated.
   * @see handleGetEventsBetweenTwoDates
   */
  const handleUpdateEventsBetweenDates = async (): Promise<void> => {
    if (startDate && endDate && !areDatesWithinTwoWeeks(startDate, endDate)) {
      const t = Toast.create({ message: "Dates must be within a 2 week range; try again", duration: 2000, color: "danger", position: "bottom" });
      t.present();
      props.setShowEventsBetweenTwoDates(false);
      props.setShowThisWeeksEvents(true);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      const t = Toast.create({ message: "Dates are invalid, try again", duration: 2000, color: "danger", position: "bottom" });
      t.present();
      props.setShowEventsBetweenTwoDates(false);
      props.setShowThisWeeksEvents(true);
      return;
    }

    const res = await handleGetEventsBetweenTwoDates(startDate, endDate);
    props.setEventsBetweenTwoDates(res.events);
    props.setShowThisWeeksEvents(false);
    props.setShowEventsBetweenTwoDates(true);
    modalRef.current && modalRef.current.dismiss();
    const t = Toast.create({ message: "Events updated", duration: 2000, color: 'secondary', position: "bottom" });
    t.present();
  };

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page])

  return (
    <IonModal ref={modalRef} presentingElement={presentingElement} trigger="map-settings-modal" handle={false}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }} scrollY={false}>
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
            <IonCheckbox className='map-modal-section-title' disabled slot='end' checked={props.showTopAttractions} onIonChange={(e) => { props.setShowTopAttractions(e.detail.checked) }}>Top Attractions</IonCheckbox>
          </IonList>
          <br />
          <IonList lines="none">
            <IonCheckbox className='map-modal-section-title' checked={props.showThisWeeksEvents} onIonChange={(e) => { props.setEventsBetweenTwoDates([]); props.setShowEventsBetweenTwoDates(false); props.setShowThisWeeksEvents(e.detail.checked); setStartDate(''); setEndDate(''); }}>Events within the week</IonCheckbox>
          </IonList>
          <br />
          <br />
          <IonLabel className='map-modal-section-title'>Select Event Date Range <i>(Max 2 weeks)</i></IonLabel>
          <br />
          <div style={{ paddingTop: '15px' }}>
            <IonLabel>Start Date</IonLabel>
            <IonInput style={context.darkMode ? { '--background': '#2d2d2d', verticalAlign: 'middle', height: '50px', lineHeight: 'normal' } : { '--background': '#e1e1e1', verticalAlign: 'middle', height: '50px', lineHeight: 'normal' }} type='date' value={startDate} onIonChange={e => setStartDate(e.detail.value!)} />
          </div>
          <br />
          <div>
            <IonLabel>End Date</IonLabel>
            <IonInput style={context.darkMode ? { '--background': '#2d2d2d', verticalAlign: 'middle', height: '50px', lineHeight: 'normal' } : { '--background': '#e1e1e1', verticalAlign: 'middle', height: '50px', lineHeight: 'normal' }} type='date' value={endDate} onIonChange={e => setEndDate(e.detail.value!)} />
          </div>
          <br />
          <IonButton
            disabled={!startDate || !endDate}
            color="secondary"
            expand="block"
            style={{ width: "100%" }}
            onClick={handleUpdateEventsBetweenDates}
          >
            Update
          </IonButton>
        </section>

      </IonContent>
    </IonModal>
  );
};


export default MapSettingsModal;