import { IonAvatar, IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFabButton, IonIcon, IonSkeletonText, useIonRouter } from "@ionic/react";

import { useContext } from "../../utils/my-context";
import { formatDate } from "../../utils/formatDate";
import avatar from '../../elements/avatar.svg';

import './Profile.css';
import { settingsOutline } from "ionicons/icons";


const ProfileBio: React.FC = () => {
  const context = useContext();
  const router = useIonRouter();

  return (
    <IonCard>
      <IonCardHeader>
        <IonAvatar>
          {!context.humspotUser ?
            <IonSkeletonText animated />
            :
            <img
              src={context.humspotUser?.profilePicURL ?? avatar}
              alt="User Profile Picture"
            />
          }
        </IonAvatar>
        <br />
        <IonCardTitle style={{ marginLeft: '1%' }}>
          {!context.humspotUser ?
            <IonSkeletonText animated style={{ width: "25%", height: "1.25rem" }} />
            :
            <>
              {context.humspotUser.accountType !== 'user' ?
                context.humspotUser.username + ' (' + context.humspotUser.accountType + ')' :
                context.humspotUser.username
              }
            </>
          }
        </IonCardTitle>
        <IonCardSubtitle style={{ marginLeft: '1%' }}>
          <p style={{ fontSize: "1.1rem" }}>
            {!context.humspotUser ?
              <>
                <IonSkeletonText animated style={{ height: "1.1rem" }} />
                <IonSkeletonText animated style={{ height: "1.1rem", width: "90%" }} />
              </>
              :
              context.humspotUser.bio
            }
          </p>
        </IonCardSubtitle>
        <IonCardSubtitle style={{ marginLeft: '1%' }}>
          <p>
            {!context.humspotUser ?
              <IonSkeletonText animated style={{ width: "70%" }} />
              :
              <>
                Member since {formatDate(context.humspotUser.dateCreated)}
              </>
            }
          </p>
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
};

export default ProfileBio;