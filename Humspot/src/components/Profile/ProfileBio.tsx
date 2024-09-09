import { IonAvatar, IonBadge, IonCard, IonFab, IonRow, IonSkeletonText, useIonRouter, useIonToast } from "@ionic/react";

import { useContext } from "../../utils/hooks/useContext";
import avatar from '../../assets/images/avatar.svg';

import './Profile.css';
import { HumspotUser } from "../../utils/types";
import { timeout } from "../../utils/functions/timeout";
import { useState } from "react";

let uniqueString: number = new Date().getTime(); // Use a timestamp to force cache refresh when updated profile info.
const MAX_BIO_LENGTH: number = 150;

type ProfileBioProps = {
  user: HumspotUser | null | undefined;
}
const ProfileBio: React.FC<ProfileBioProps> = (props: ProfileBioProps) => {

  const { user } = props;
  const context = useContext();
  const router = useIonRouter();
  const [presentToast] = useIonToast();
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);

  return (
    <>
      {user && user.accountType !== 'user' &&
        <IonFab vertical="top" horizontal="end" edge className='profile-card-badge'>
          <IonBadge style={{ zIndex: 9999 }}>{user.accountType.toUpperCase()}</IonBadge>
        </IonFab>
      }
      <IonCard className='ion-no-margin profile-bio-card'>

        <div style={{ height: "10px" }} />

        <section id='top-bio'>
          <IonRow className='profile-bio-picture-and-stats-row'>
            <IonAvatar className='profile-bio-avatar-picture'>
              {user === null ?
                <IonSkeletonText animated />
                :
                user === undefined ?
                  <img src={avatar}
                    alt="Default Profile Picture"
                  />
                  :
                  <img
                    src={`${user.profilePicURL ?? avatar}?${uniqueString}`}
                    alt="User Profile Picture"
                  />
              }
            </IonAvatar>
          </IonRow>
        </section>

        <section id='bottom-bio'>
          <p className={`profile-bio-text ${isBioExpanded ? 'expanded' : 'collapsed'}`}>
            {user === null ?
              (
                <>
                  <IonSkeletonText animated style={{ height: "1.1rem" }} />
                  <IonSkeletonText animated style={{ height: "1.1rem", width: "90%" }} />
                </>
              )
              :
              user === undefined ?
                (
                  <span style={{ color: context.darkMode ? 'white' : 'black' }}>
                    Hello, welcome to Humspot! To RSVP for events, add comments, and submit your own activities,
                    <span style={{ whiteSpace: 'pre', marginLeft: '5px', color: "var(--ion-color-primary)", textDecoration: 'underline' }}
                      onClick={async () => { context.setShowTabs(false); await timeout(500); router.push("/sign-up") }}>
                      sign up for an account.
                    </span>
                  </span>
                )
                :
                (
                  <span style={{ color: context.darkMode ? 'white' : 'black' }}>
                    {isBioExpanded ? user.bio : user.bio && user.bio.length > 0 && user.bio.substring(0, MAX_BIO_LENGTH)}
                    {user.bio && user.bio.length > MAX_BIO_LENGTH && (
                      <span className="bio-toggle" onClick={() => setIsBioExpanded((prev) => !prev)}>
                        {isBioExpanded ? ' Less' : ' ... More'}
                      </span>
                    )}
                  </span>
                )
            }
          </p>
        </section>

      </IonCard>
    </>
  )
};

export default ProfileBio;