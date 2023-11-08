import { memo, useCallback, useEffect, useState } from "react";
import { useContext } from "../../utils/my-context";
import { handleAddToFavorites, handleAddToRSVP, handleAddToVisited, handleGetFavoritesAndVisitedAndRSVPStatus } from "../../utils/server";
import { useToast } from "@agney/ir-toast";
import { IonButton, IonIcon } from "@ionic/react";
import { calendar, calendarOutline, star, starOutline, walk, walkOutline } from "ionicons/icons";


const ActivityFavoriteVisitedButton = (props: { id: string, activityType: 'event' | 'attraction' | 'custom' | undefined }) => {

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
    } else if (res && res.removed) {
      setFavorited(false);
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
    } else if (res && res.removed) {
      setVisited(false);
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
    } else if (res && res.removed) {
      setRsvp(false);
    }
  }

  const getButtonStatus = useCallback(async () => {
    if (!context.humspotUser || !id) return;
    const response = await handleGetFavoritesAndVisitedAndRSVPStatus(
      context.humspotUser.userID,
      id
    );
    if (response.favorited) {
      setFavorited(true);
    } else {
      setFavorited(false);
    }

    if (response.visited) {
      setVisited(true);
    } else {
      setVisited(false);
    }
    if (response.rsvp) {
      setRsvp(true);
    } else {
      setRsvp(false);
    }
  }, [context.humspotUser]);

  useEffect(() => {
    getButtonStatus();
  }, [getButtonStatus])

  return (
    <>

      <IonButton
        className="FavoritesButton"
        fill="clear"
        color={"secondary"}
        size="large"
        id="FavoritesButton"
        onClick={clickOnFavorite}
        disabled={favorited === null}
      >
        <IonIcon
          slot="icon-only"
          icon={favorited === true ? star : starOutline}
        />
      </IonButton>

      {activityType == "event" ?
        <IonButton
          className="VisitedButton"
          fill="clear"
          color={"secondary"}
          size="large"
          id="RSVPButton"
          disabled={rsvp === null}
          onClick={clickOnRsvp}
        >
          <IonIcon
            slot="icon-only"
            icon={rsvp === true ? calendar : calendarOutline}
          ></IonIcon>
        </IonButton>
        :
        <IonButton
          className="VisitedButton"
          fill="clear"
          color={"secondary"}
          size="large"
          id="VisitedButton"
          disabled={visited === null}
          onClick={clickOnVisited}
        >
          <IonIcon slot="icon-only" icon={visited === true ? walk : walkOutline}></IonIcon>
        </IonButton>
      }
    </>
  );

};

export default memo(ActivityFavoriteVisitedButton);