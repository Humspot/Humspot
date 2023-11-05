import { IonButton, IonIcon } from "@ionic/react";
import { calendar, calendarOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import {
  handleAddToRSVP,
  handleGetFavoritesAndVisitedStatus,
} from "../../utils/server";
import { useContext } from "../../utils/my-context";
import { useToast } from "@agney/ir-toast";

const ActivityRSVPButton = (props: { activity: any; id: string }) => {
  const context = useContext();
  const Toast = useToast();
  const { activity, id } = props;
  const [isRSVP, setIsRSVP] = useState(false);
  // fetchRSVP
  const fetchRSVP = useCallback(async () => {
    if (!context.humspotUser) return;
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
    if (response.rsvp) {
      setIsRSVP(true);
    }
  }, [context.humspotUser]);
  //buttonAddToRSVP
  async function buttonAddToRSVP(activity: any) {
    const date = new Date();
    const res = await handleAddToRSVP(
      context.humspotUser?.userID as string,
      id,
      date.toISOString()
    );
    if (res && !res.removed) {
      setIsRSVP(true);
    }
    if (res && res.removed) {
      setIsRSVP(false);
    }
  }

  // fetchRSVP runs on load, check if this activity is already RSVP'd
  useEffect(() => {
    fetchRSVP();
  }, [fetchRSVP]);
  // clickOnRSVP grabs the input a
  function clickOnRSVP(): void {
    buttonAddToRSVP(activity);
  }
  return (
    <IonButton
      className="VisitedButton"
      fill="clear"
      color={"secondary"}
      size="large"
      id="RSVPButton"
      onClick={() => clickOnRSVP()}
    >
      <IonIcon
        slot="icon-only"
        icon={isRSVP ? calendar : calendarOutline}
      ></IonIcon>
    </IonButton>
  );
};

export default ActivityRSVPButton;
