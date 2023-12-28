import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { compass, time } from "ionicons/icons";
import { formatDate } from "../../utils/functions/formatDate";
import { ActivityLocationMap } from "./ActivityLocationMap";
import { HumspotActivity } from "../../utils/types";

const ActivityDateTimeLocation = (props: { activity: HumspotActivity | null }) => {
  const { activity } = props;
  return (
    <IonCard className='activity-card'>
      {activity ? (
        <IonCardContent className="locationcard">
          <IonText>
            <div className="locationlabel">
              {/* <IonIcon icon={compass} size='small'></IonIcon> */}
              <h2>{activity?.location ?? ""}</h2>
            </div>
            {activity?.date &&
              <>
                <br />
                <div className="locationlabel">
                  {/* <IonIcon icon={time} size='small'></IonIcon> */}
                  <h2>{formatDate(activity?.date ?? "")}</h2>
                </div>
              </>
            }
          </IonText>

          <div className="locationmap">
            {activity && (
              <ActivityLocationMap
                latitude={activity.latitude}
                longitude={activity.longitude}
                activityName={activity.name}
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
