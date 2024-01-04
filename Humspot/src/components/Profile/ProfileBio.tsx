import { IonAvatar, IonCard, IonRow, IonSkeletonText } from "@ionic/react";

import { useContext } from "../../utils/hooks/useContext";
import avatar from '../../assets/images/avatar.svg';

import './Profile.css';

let uniqueString = new Date().getTime(); // Use a timestamp to force cache refresh

const ProfileBio: React.FC = () => {

  const context = useContext();

  return (
    <IonCard className='ion-no-margin profile-bio-card'>
      
      <div style={{ height: "10px" }} />

      <section id='top-bio'>
        <IonRow className='profile-bio-picture-and-stats-row'>
          <IonAvatar className='profile-bio-avatar-picture'>
            {!context.humspotUser ?
              <IonSkeletonText animated />
              :
              <img
                src={`${context.humspotUser.profilePicURL ?? avatar}?${uniqueString}`}
                alt="User Profile Picture"
              />
            }
          </IonAvatar>
          {/* {context.humspotUser && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 0.9 }}>
              <div className="" style={{ textAlign: 'center' }}>
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
          )} */}
        </IonRow>
      </section>

      <section id='bottom-bio'>
        <p className='profile-bio-text'>
          {!context.humspotUser ?
            <>
              <IonSkeletonText animated style={{ height: "1.1rem" }} />
              <IonSkeletonText animated style={{ height: "1.1rem", width: "90%" }} />
            </>
            :
            <>
              {context.humspotUser.bio}
            </>

          }
        </p>
      </section>

    </IonCard>
  )
};

export default ProfileBio;