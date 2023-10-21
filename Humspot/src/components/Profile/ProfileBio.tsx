import { IonAvatar, IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonFab, IonFabButton, IonIcon, IonSkeletonText, useIonRouter } from "@ionic/react";

import { useContext } from "../../utils/my-context";
import { formatDate } from "../../utils/formatDate";
import avatar from '../../elements/avatar.svg';

import './Profile.css';
import { settingsOutline } from "ionicons/icons";


const ProfileBio: React.FC = () => {
  const context = useContext();

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

        {context.humspotUser &&
          <IonChip color='primary' style={{ position: 'absolute', top: '10px', right: '10px' }}>{context.humspotUser.accountType}</IonChip>
        }

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