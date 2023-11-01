import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import clickOnFavorite from "../../pages/ActivityPage";
import { useState } from "react";

const ActivityFavoriteButton = (props: { activity: any }) => {
  // Access the props you passed in
  const { activity } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  function clickOnFavorite(): void {
    setIsFavorite(!isFavorite);
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
