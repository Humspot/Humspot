import { memo, useCallback, useEffect, useState } from "react";
import { useContext } from "../../utils/my-context";
import { handleAddToFavorites, handleAddToRSVP, handleAddToVisited, handleGetFavoritesAndVisitedAndRSVPStatus } from "../../utils/server";
import { useToast } from "@agney/ir-toast";
import { IonButton, IonIcon } from "@ionic/react";
import { calendar, calendarOutline, heart, heartOutline, star, starOutline, walk, walkOutline } from "ionicons/icons";


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
      const t = Toast.create({ message: "Added to favorites!", duration: 2000, color: "secondary" });
      t.present();
    } else if (res && res.removed) {
      setFavorited(false);
      const t = Toast.create({ message: "Removed from favorites", duration: 2000, color: "light" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong...", duration: 2000, color: "danger" });
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
      const t = Toast.create({ message: "Added to visited!", duration: 2000, color: "secondary" });
      t.present();
    } else if (res && res.removed) {
      setVisited(false);
      const t = Toast.create({ message: "Removed from visited", duration: 2000, color: "light" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong...", duration: 2000, color: "danger" });
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
      const t = Toast.create({ message: "RSVP'd for event!", duration: 2000, color: "light" });
      t.present();
    } else if (res && res.removed) {
      setRsvp(false);
      const t = Toast.create({ message: "Removed RSVP from event.", duration: 2000, color: "light" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong...", duration: 2000, color: "danger" });
      t.present();
    }
  }

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
    <div style={{ zIndex: "1000" }}>

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
          icon={favorited === true ? heart : heartOutline}
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
        activityType == "attraction" ?
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
          :
          <></>
      }
    </div>
  );

};

export default memo(ActivityFavoriteVisitedButtons);