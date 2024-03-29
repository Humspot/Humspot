/**
 * @file ActivityHeaderTitle.tsx
 * @fileoverview card containing the title of the Activity along with a button to rate the activity (attractions only).
 */

import { IonButton, IonButtons, IonCard, IonCardTitle, IonContent, IonHeader, IonModal, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react'
import { Rating } from 'react-custom-rating-component'
import { useContext } from '../../utils/hooks/useContext';
import { handleAddRating } from '../../utils/server';
import { useToast } from '@agney/ir-toast';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getUserRatingGivenUserID } from '../../utils/server';
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

type ActivityHeaderTitleProps = {
  activity: boolean;
  activityType: 'event' | 'attraction' | 'custom' | undefined;
  id: string;
  name: string | undefined;
  avgRating: number | undefined;
  page: HTMLElement | undefined;
};

const ActivityHeaderTitle = (props: ActivityHeaderTitleProps) => {

  const context = useContext();
  const Toast = useToast();

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [newUserRating, setNewUserRating] = useState<number>(0);
  const [originalUserRating, setOriginalUserRating] = useState<number>(0);
  const [hasUpdated, setHasUpdated] = useState<boolean>(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState<boolean>(false);

  const submitRating = async () => {
    if (!context.humspotUser) return;
    if (!newUserRating) return;
    setRatingLoading(true);
    const res = await handleAddRating(context.humspotUser.userID, props.id, newUserRating);
    if (res.success) {
      const t = Toast.create({ message: 'Rating added!', position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
    setOriginalUserRating(newUserRating);
    setRatingLoading(false);
  };

  const getUserRating = useCallback(async () => {
    if (!context.humspotUser) return;
    setRatingLoading(true);
    const res = await getUserRatingGivenUserID(context.humspotUser.userID, props.id);
    if (res.success) {
      setOriginalUserRating(res.ratingInfo?.rating ?? 0);
      setRatingLoading(false);
    } else {
      const t = Toast.create({ message: 'Unable to get user rating, unable to rate at this time', position: 'bottom', color: 'danger', duration: 2000 });
      t.present();
    }
    setRatingLoading(false);
    setHasLoadedInitial(true);
  }, [context.humspotUser]);

  useEffect(() => {
    getUserRating();
  }, [getUserRating])

  return (
    <FadeIn>
      <IonCard color='primary' className='activity-header-card activity-card'>
        <section style={{ padding: '10px' }}>
          {props.activity ? (
            <>
              {<h1>{props.name}</h1>}
              {props.activityType === 'attraction' &&
                <>
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
                    <Rating
                      readOnly={true}
                      defaultValue={props.avgRating ?? 0}
                      spacing='5px'
                      activeColor='#F6D075'
                      precision={0.5}
                    />
                  </div>

                  {context.humspotUser &&
                    <div>
                      <IonButton className='ion-no-padding ion-no-margin' slot='start' fill='clear' style={{ color: '#3D6876' }} id='add-rating-button'>
                        Add Rating
                      </IonButton>
                    </div>
                  }
                </>
              }
            </>
          ) : (
            <IonCardTitle>
              <IonSkeletonText animated></IonSkeletonText>
            </IonCardTitle>
          )}
        </section>
      </IonCard>

      {props.activityType === 'attraction' &&
        <IonModal trigger='add-rating-button' ref={modalRef} presentingElement={props.page}>
          <IonContent style={{ '--background': 'var(--ion-item-background' }} scrollY={false}>
            <IonHeader className='ion-no-border'>
              <IonToolbar style={{ '--background': 'var(--ion-item-background' }}>
                <IonTitle style={{ fontSize: '1.25rem' }}>Rate Attraction</IonTitle>
                <IonButtons style={{ height: '5vh' }}>
                  <IonButton style={{ fontSize: '1.15em', }} onClick={() => { modalRef.current?.dismiss().then(() => { setNewUserRating(originalUserRating); setHasUpdated(false); }) }}>
                    <p>Back</p>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <b><p className='ion-text-center' style={{ padding: '10px' }}>Been here before? Give it a rating to let Humspot users know what you thought!</p></b>
            <section style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
              ...ratingLoading ? { opacity: '0.5' } : { opacity: '1' }
            }}>
              {hasLoadedInitial ?
                <Rating
                  readOnly={ratingLoading}
                  defaultValue={originalUserRating}
                  size='30px'
                  spacing='10px'
                  activeColor='#F6D075'
                  precision={0.5}
                  onChange={(newRating) => { setHasUpdated(true); setNewUserRating(newRating) }}
                />
                :
                <>
                  <IonSkeletonText style={{ height: '30px', width: '75vw' }} animated />
                </>
              }
            </section>
            {!!originalUserRating && !hasUpdated &&
              <p className='ion-text-center'>You previously gave this a {originalUserRating} / 5</p>
            }
            <IonButton disabled={!hasUpdated || ratingLoading} color='secondary' expand='block' style={{ padding: '10px' }} onClick={async () => await submitRating()}>Submit</IonButton>
          </IonContent>
        </IonModal>
      }

    </FadeIn>
  )
};

export default ActivityHeaderTitle;