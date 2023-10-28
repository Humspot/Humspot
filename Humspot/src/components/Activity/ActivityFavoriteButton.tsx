import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import clickOnFavorite from "../../pages/ActivityPage";
import { useCallback, useEffect, useState } from "react";
import {
  handleAddToFavorites,
  handleGetFavoritesGivenUserID,
} from "../../utils/server";
import { useContext } from "../../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { HumspotFavoriteResponse } from "../../utils/types";

const ActivityFavoriteButton = (props: { activity: any }) => {
  const context = useContext();
  const Toast = useToast();
  const { activity } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<HumspotFavoriteResponse[]>([]);
  // fetchFavorites grabs the favorites list
  const fetchFavorites = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetFavoritesGivenUserID(
      1,
      context.humspotUser.userID
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setFavorites(response.favorites);
  }, [context.humspotUser]);
  //buttonAddToFavorites handles when the user clicks on the EMPTY favorites star
  async function buttonAddToFavorites(activity: any) {
    const res = await handleAddToFavorites(
      context.humspotUser?.userID as string,
      activity.activityID
    );
    if (res) {
      setIsFavorite(true);
    }
  }
  //buttonRemoveFromFavorites handles when the user clicks on the FULL favorites star

  // fetchFavorites runs on load, check if this activity is already a favorite
  useEffect(() => {
    fetchFavorites();
    if (favorites.includes(activity?.activityID)) {
      setIsFavorite(true);
    }
  }, [fetchFavorites]);
  // clickOnFavorite grabs the input and hands it to either buttonAddToFavorites or buttonRemoveFromFavorites
  function clickOnFavorite(): void {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      buttonAddToFavorites(activity);
    }
  }
  return (
    <IonButton
      className="FavoritesButton"
      fill="clear"
      color={"secondary"}
      size="large"
      id="FavoritesButton"
      onClick={() => clickOnFavorite()}
    >
      <IonIcon
        slot="icon-only"
        icon={isFavorite ? star : starOutline}
      ></IonIcon>
    </IonButton>
  );
};

export default ActivityFavoriteButton;
