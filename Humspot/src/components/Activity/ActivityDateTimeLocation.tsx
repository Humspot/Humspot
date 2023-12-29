import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonRow } from "@ionic/react";
import { formatDate } from "../../utils/functions/formatDate";
import { ActivityLocationMap } from "./ActivityLocationMap";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

type ActivityDateTimeLocationProps = {
  location: string;
  date: string;
  name: string;
  latitude: string | null;
  longitude: string | null;
}

const ActivityDateTimeLocation = (props: ActivityDateTimeLocationProps) => {

  const { location, date, latitude, longitude, name } = props;


  return (
    <FadeIn>
      <IonCard className='activity-card'>
        <IonCardContent>
          <IonRow style={{ paddingBottom: "10px" }}>
            <IonCardHeader className='ion-no-padding ion-no-margin'>
              <IonCardTitle style={{ fontSize: "1.25rem" }}>Location</IonCardTitle>
            </IonCardHeader>
          </IonRow>
          <IonRow>
            <IonCol size='7' className='ion-no-padding ion-no-margin'>
              <div >
                <h2>{location ?? ""}</h2>
              </div>
              {date &&
                <>
                  <br />
                  <div>
                    <h2>{formatDate(date ?? "")}</h2>
                  </div>
                </>
              }
            </IonCol>
            <IonCol></IonCol>
            <IonCol className='ion-no-padding ion-no-margin'>
              <div>
                {latitude && longitude && name && (
                  <ActivityLocationMap
                    latitude={latitude}
                    longitude={longitude}
                    activityName={name}
                  />
                )}
              </div>
            </IonCol>
          </IonRow>

        </IonCardContent>
      </IonCard>
    </FadeIn>
  );
};

export default ActivityDateTimeLocation;
