/**
 * @file ActivityFavoriteVisitedRSVPButton.tsx
 * @fileoverview the header at the top of the Activity page. Contains a button to Favorite an activity, 
 * say that one Visited the activity, a button to RSVP for an activity (events only), and a button to share
 * the link using the native Share interface.
 */

import { memo, useCallback, useEffect, useState } from 'react';
import useContext from '../../utils/hooks/useContext';
import { handleAddToFavorites, handleAddToRSVP, handleAddToVisited, handleGetFavoritesAndVisitedAndRSVPStatus } from '../../utils/server';
import { useToast } from '@agney/ir-toast';
import { IonButton, IonIcon } from '@ionic/react';
import { calendar, calendarOutline, heart, heartOutline, shareOutline, walk, walkOutline } from 'ionicons/icons';
import { isPastDate } from '../../utils/functions/calcDates';
import { handleShare } from '../../utils/functions/handleShare';
import { formatDate } from '../../utils/functions/formatDate';


const ActivityFavoriteVisitedButtons = (props: { id: string, activityType: 'event' | 'attraction' | 'custom' | undefined, activityDate: string | undefined }) => {

  const { id, activityType, activityDate } = props;

  const context = useContext();
  const Toast = useToast();

  // null is loading
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const [visited, setVisited] = useState<boolean | null>(null);
  const [rsvp, setRsvp] = useState<boolean | null>(null);

  const clickOnFavorite = async () => {
    if (!context.humspotUser || favorited === null) return;
    setFavorited(null);
    const res = await handleAddToFavorites(
      context.humspotUser.userID,
      id
    );
    if (res && !res.removed) {
      setFavorited(true);
      const t = Toast.create({ message: 'Added to favorites!', position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setFavorited(false);
      const t = Toast.create({ message: 'Removed from favorites', position: 'bottom', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
  };

  const clickOnVisited = async () => {
    if (!context.humspotUser || visited === null) return;
    setVisited(null);
    const res = await handleAddToVisited(
      context.humspotUser.userID,
      id,
      new Date().toISOString()
    );
    if (res && !res.removed) {
      setVisited(true);
      const t = Toast.create({ message: 'Added to visited!', position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setVisited(false);
      const t = Toast.create({ message: 'Removed from visited', position: 'bottom', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
  };

  const clickOnRsvp = async () => {
    if (!context.humspotUser || rsvp === null) return;
    setRsvp(null);
    const res = await handleAddToRSVP(
      context.humspotUser.userID,
      id,
      new Date().toISOString()
    );
    if (res && !res.removed) {
      setRsvp(true);
      const t = Toast.create({ message: "RSVP'd for event!", position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setRsvp(false);
      const t = Toast.create({ message: 'Removed RSVP from event.', position: 'bottom', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
  };

  /**
   * @description gets whether a user has clicked the buttons before to determine whether they should
   * be filled or not. Called on page load.
   * @see handleGetFavoritesAndVisitedAndRSVPStatus
   */
  const getButtonStatus = useCallback(async () => {
    if (!context.humspotUser || !id) return;
    const response = await handleGetFavoritesAndVisitedAndRSVPStatus(context.humspotUser.userID, id);
    setFavorited(response.favorited);
    setVisited(response.visited);
    setRsvp(response.rsvp);
  }, [context.humspotUser]);
  useEffect(() => {
    getButtonStatus();
  }, [getButtonStatus])


  return (
    <div style={{ zIndex: '1000' }}>

      {context.humspotUser &&
        <>
          <IonButton
            className='activity-favorites-button'
            fill='clear'
            color={'secondary'}
            // size='large'
            onClick={clickOnFavorite}
            disabled={favorited === null}
          >
            <IonIcon
              slot='icon-only'
              icon={favorited === true ? heart : heartOutline}
            />
          </IonButton>

          {activityType == 'event' && !isPastDate(formatDate(activityDate ?? null) ?? '') ?
            <IonButton
              className='activity-visited-button'
              fill='clear'
              color={'secondary'}
              // size='large'
              disabled={rsvp === null}
              onClick={clickOnRsvp}
            >
              <IonIcon
                slot='icon-only'
                icon={rsvp === true ? calendar : calendarOutline}
              ></IonIcon>
            </IonButton>
            :
            activityType == 'attraction' ?
              <IonButton
                className='activity-visited-button'
                fill='clear'
                color={'secondary'}
                // size='large'
                disabled={visited === null}
                onClick={clickOnVisited}
              >
                <IonIcon slot='icon-only' icon={visited === true ? walk : walkOutline}></IonIcon>
              </IonButton>
              :
              <></>
          }
        </>
      }

      <IonButton
        fill='clear'
        color='secondary'
        // size='large'
        onClick={async () => {
          const activityTypeUpper: string = activityType ? activityType[0].toUpperCase() + activityType?.slice(1) : 'Activity';
          await handleShare(`Check out this ${activityTypeUpper} on Humspot!`);
        }}
      >
        <IonIcon style={{ transform: 'scale(1.1)' }} icon={shareOutline} />
      </IonButton>

    </div>
  );

};

export default memo(ActivityFavoriteVisitedButtons);