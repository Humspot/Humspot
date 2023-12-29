import { memo, useCallback, useEffect, useState } from 'react';
import { useContext } from '../../utils/hooks/useContext';
import { handleAddToFavorites, handleAddToRSVP, handleAddToVisited, handleGetFavoritesAndVisitedAndRSVPStatus } from '../../utils/server';
import { useToast } from '@agney/ir-toast';
import { IonButton, IonIcon } from '@ionic/react';
import { calendar, calendarOutline, heart, heartOutline, shareOutline, walk, walkOutline } from 'ionicons/icons';
import { Share } from '@capacitor/share';


const ActivityFavoriteVisitedButtons = (props: { id: string, activityType: 'event' | 'attraction' | 'custom' | undefined }) => {

  const { id, activityType } = props;

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
      const t = Toast.create({ message: 'Added to favorites!', position: 'top', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setFavorited(false);
      const t = Toast.create({ message: 'Removed from favorites', position: 'top', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'top', duration: 2000, color: 'danger' });
      t.present();
    }
  }

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
      const t = Toast.create({ message: 'Added to visited!', position: 'top', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setVisited(false);
      const t = Toast.create({ message: 'Removed from visited', position: 'top', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'top', duration: 2000, color: 'danger' });
      t.present();
    }
  }

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
      const t = Toast.create({ message: "RSVP'd for event!", position: 'top', duration: 2000, color: 'secondary' });
      t.present();
    } else if (res && res.removed) {
      setRsvp(false);
      const t = Toast.create({ message: 'Removed RSVP from event.', position: 'top', duration: 2000, color: 'dark' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Something went wrong...', position: 'top', duration: 2000, color: 'danger' });
      t.present();
    }
  }

  const handleShare = async () => {
    const activityTypeUpper: string = activityType ? activityType[0].toUpperCase() + activityType?.slice(1) : 'Activity';
    await Share.share({
      "text": `Check out this ${activityTypeUpper} on Humspot!`,
      "title": "Check out this ${activityTypeUpper} on Humspot!",
      "url": "https://humspotapp.com" + window.location.pathname
    });
  };

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

      <IonButton
        className=''
        fill='clear'
        color='secondary'
        size='large'
        onClick={handleShare}
      >
        <IonIcon style={{ transform: 'scale(1.1)' }} icon={shareOutline} />
      </IonButton>

      {context.humspotUser &&
        <>
          <IonButton
            className='FavoritesButton'
            fill='clear'
            color={'secondary'}
            size='large'
            onClick={clickOnFavorite}
            disabled={favorited === null}
          >
            <IonIcon
              slot='icon-only'
              icon={favorited === true ? heart : heartOutline}
            />
          </IonButton>

          {activityType == 'event' ?
            <IonButton
              className='VisitedButton'
              fill='clear'
              color={'secondary'}
              size='large'
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
                className='VisitedButton'
                fill='clear'
                color={'secondary'}
                size='large'
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
    </div>
  );

};

export default memo(ActivityFavoriteVisitedButtons);