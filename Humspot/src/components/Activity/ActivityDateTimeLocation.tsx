import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { compass, time } from "ionicons/icons";
import { formatDate } from "../../utils/formatDate";
import { LocationMap } from "./ActivityLocationMap";
import { useState } from "react";

const ActivityDateTimeLocation = (props: { activity: any }) => {
  const { activity } = props;
  return (
    <IonCard>
      {activity ? (
        <IonCardContent className="locationcard">
          <IonText color={"dark"}>
            <div className="locationlabel">
              <IonIcon icon={compass} size="small"></IonIcon>
              <h2>{activity?.location ?? ""}</h2>
            </div>
            <div className="locationlabel">
              <IonIcon icon={time} size="small"></IonIcon>
              <h2>{formatDate(activity?.date ?? "")}</h2>
            </div>
          </IonText>

          <div className="locationmap">
            {activity && (
              <LocationMap
                latitude={activity.latitude}
                longitude={activity.longitude}
              />
            )}
          </div>
        </IonCardContent>
      ) : (
        <IonCardContent>
          <p>
            <IonSkeletonText animated></IonSkeletonText>
          </p>
          <p>
            <IonSkeletonText animated></IonSkeletonText>
          </p>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default ActivityDateTimeLocation;
