/**
 * @file ProfileBio.tsx
 * @fileoverview the card a the top of the Profile page containing the user's
 * profile information (picture + bio).
 */

import { useEffect, useState } from "react";
import { IonAvatar, IonBadge, IonCard, IonFab, IonRow, IonSkeletonText, useIonRouter, useIonToast } from "@ionic/react";

import useContext from "../../utils/hooks/useContext";
import avatar from '../../assets/images/avatar.svg';

import './Profile.css';
import { HumspotUser } from "../../utils/types";
import { timeout } from "../../utils/functions/timeout";

let uniqueString: number = new Date().getTime(); // Use a timestamp to force cache refresh when updated profile info.
const MAX_BIO_LENGTH: number = 150;

type ProfileBioProps = {
  user: HumspotUser | null | undefined;
  blocked: boolean;
}

const ProfileBio = (props: ProfileBioProps) => {

  const humspotUser = props.user;
  const context = useContext();
  const [presentToast] = useIonToast();
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);
  const router = useIonRouter();

  useEffect(() => {
    console.log(props.user);
    if (props.user === undefined && context.humspotUser !== undefined) {
      presentToast({ message: "User is blocked!", duration: 3000, color: 'danger' });
    }
  }, [props.user])

  return (
    <>
      {humspotUser && humspotUser.accountType !== 'user' &&
        <IonFab vertical="top" horizontal="end" edge className='profile-card-badge'>
          <IonBadge style={{ zIndex: 9999 }}>{humspotUser.accountType.toUpperCase()}</IonBadge>
        </IonFab>
      }
      <IonCard className='ion-no-margin profile-bio-card'>

        <div style={{ height: "10px" }} />

        <section id='top-bio'>
          <IonRow className='profile-bio-picture-and-stats-row'>
            <IonAvatar className='profile-bio-avatar-picture'>
              {humspotUser === null ?
                <IonSkeletonText animated />
                :
                humspotUser === undefined ?
                  <img src={avatar}
                    alt="Default Profile Picture"
                  />
                  :
                  <img
                    src={`${humspotUser.profilePicURL ?? avatar}?${uniqueString}`}
                    alt="User Profile Picture"
                  />
              }
            </IonAvatar>
            {/* {humspotUser && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 0.9 }}>
                <div className="" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    0
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>Following</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    0
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>Visited</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    0
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>Reviews</div>
                </div>
              </div>
            )} */}
          </IonRow>
        </section>

        <section id='bottom-bio'>
          <p className={`profile-bio-text ${isBioExpanded ? 'expanded' : 'collapsed'}`}>
            {humspotUser === null ?
              (
                <>
                  <IonSkeletonText animated style={{ height: "1.1rem", borderRadius: '5px' }} />
                  <IonSkeletonText animated style={{ height: "1.1rem", width: "90%", borderRadius: '5px' }} />
                </>
              )
              :
              props.blocked ?
                <>
                  This user is blocked.
                </>
              :
              humspotUser === undefined ?
                (
                  <span style={{ color: context.darkMode ? 'white' : 'black' }}>
                    You are using Humspot as a guest. To submit events, add comments, and more, &nbsp;
                    <span style={{ color: "var(--ion-color-primary)", textDecoration: 'underline' }}
                      onClick={async () => { context.setShowTabs(false); await timeout(250); router.push("/sign-up") }}>
                      sign in to an account.
                    </span>
                  </span>
                )
                :
                (
                  <span style={{ color: context.darkMode ? 'white' : 'black' }}>
                    {isBioExpanded ? humspotUser.bio : humspotUser.bio && humspotUser.bio.length > 0 && humspotUser.bio.substring(0, MAX_BIO_LENGTH)}
                    {humspotUser.bio && humspotUser.bio.length > MAX_BIO_LENGTH && (
                      <span className="bio-toggle" onClick={() => setIsBioExpanded((prev) => !prev)}>
                        {isBioExpanded ? ' Less' : ' ... More'}
                      </span>
                    )}
                  </span>
                )
            }
          </p>
        </section>

      </IonCard >
    </>
  )
};

export default ProfileBio;