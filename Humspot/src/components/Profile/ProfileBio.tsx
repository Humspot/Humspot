import {
  IonAvatar, IonCard, IonCardHeader, IonCardSubtitle,
  IonChip, IonRow, IonSkeletonText
} from "@ionic/react";

import { useContext } from "../../utils/my-context";
import { formatDate } from "../../utils/formatDate";
import avatar from '../../assets/images/avatar.svg';

import './Profile.css';

const ProfileBio: React.FC = () => {

  const context = useContext();

  return (
    <>
      <IonCard>
        <IonCardHeader>

          <IonRow style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <IonAvatar style={{ flexShrink: 0, marginRight: '15%' }}>
              {!context.humspotUser ?
                <IonSkeletonText animated />
                :
                <img
                  src={context.humspotUser?.profilePicURL ?? avatar}
                  alt="User Profile Picture"
                />
              }
            </IonAvatar>
            {context.humspotUser && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 0.9 }}>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
                    100
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>Visited</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
                    50
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>Humspots</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>
                    3
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>Comments</div>
                </div>
              </div>
            )}
          </IonRow>

          <p style={{ fontSize: "0.9rem" }}>
            {!context.humspotUser ?
              <>
                <IonSkeletonText animated style={{ height: "0.9rem" }} />
                <IonSkeletonText animated style={{ height: "0.9rem", width: "90%" }} />
              </>
              :
              <>
                {context.humspotUser.bio}
              </>

            }
          </p>

        </IonCardHeader>
      </IonCard>
    </>
  )
};

export default ProfileBio;