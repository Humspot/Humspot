import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import clickOnFavorite from "../../pages/ActivityPage";
import { useCallback, useEffect, useState } from "react";
import {
  handleAddToFavorites,
  handleGetFavoritesAndVisitedStatus,
  handleGetFavoritesGivenUserID,
} from "../../utils/server";
import { useContext } from "../../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { HumspotFavoriteResponse } from "../../utils/types";

const ActivityFavoriteButton = (props: { activity: any; id: string }) => {
  const context = useContext();
  const Toast = useToast();
  const { activity, id } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  // fetchFavorites grabs the favorites list
  const fetchFavorites = useCallback(async () => {
    if (!context.humspotUser) return;
    console.log("DEBUG: Favorites Button ID: " + id);
    console.log(
      "DEBUG: Favorites Button userID: " + context.humspotUser.userID
    );
    const response = await handleGetFavoritesAndVisitedStatus(
      context.humspotUser.userID,
      id
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    if (response.favorited) {
      setIsFavorite(true);
    }
  }, [context.humspotUser]);
  //buttonAddToFavorites handles when the user clicks on the favorites star
  async function buttonAddToFavorites(activity: any) {
    const res = await handleAddToFavorites(
      context.humspotUser?.userID as string,
      id
    );
    if (res && !res.removed) {
      setIsFavorite(true);
    }
    if (res && res.removed) {
      setIsFavorite(false);
    }
  }

  // fetchFavorites runs on load, check if this activity is already a favorite
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);
  // clickOnFavorite grabs the input and hands it to either buttonAddToFavorites or buttonRemoveFromFavorites
  function clickOnFavorite(): void {
    buttonAddToFavorites(activity);
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
