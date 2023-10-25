import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonChip, IonRow, IonSkeletonText } from "@ionic/react";

import { useContext } from "../../utils/my-context";
import { formatDate } from "../../utils/formatDate";
import avatar from '../../elements/avatar.svg';

import './Profile.css';


const ProfileBio: React.FC = () => {
  const context = useContext();

  return (
    <IonCard>
      <IonCardHeader>

        <IonRow style={{ width: '100%', display: 'flex', alignItems: 'center' }}> {/* Ensure full width and center alignment */}
          <IonAvatar style={{ flexShrink: 0, marginRight: '15%' }}> {/* Prevent shrinking */}
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
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                  100
                </div>
                <div style={{ fontSize: '0.95rem' }}>Visited</div>
              </div>
              <div className="user-stat" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                  50
                </div>
                <div style={{ fontSize: '0.95rem' }}>Humspots</div>
              </div>
              <div className="user-stat" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                  3
                </div>
                <div style={{ fontSize: '0.95rem' }}>Stuffs</div>
              </div>
            </div>
          )}
        </IonRow>


        {context.humspotUser && context.humspotUser.accountType !== 'user' &&
          <IonChip outline color='primary' style={{ position: 'absolute', bottom: '10px', right: '10px' }}>{context.humspotUser.accountType}</IonChip>
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