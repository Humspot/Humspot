import { IonButton, IonIcon } from "@ionic/react";
import { star, starOutline, walk, walkOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import {
  handleGetFavoritesAndVisitedStatus,
  handleAddToVisited,
} from "../../utils/server";
import { useContext } from "../../utils/my-context";
import { useToast } from "@agney/ir-toast";

const ActivityVisitedButton = (props: { activity: any; id: string }) => {
  const context = useContext();
  const Toast = useToast();
  const { activity, id } = props;
  const [isVisited, setIsVisited] = useState(false);
  // fetchVisiteds grabs the Visiteds list
  const fetchVisited = useCallback(async () => {
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
    if (response.visited) {
      setIsVisited(true);
    }
  }, [context.humspotUser]);
  //buttonAddToVisited handles when the user clicks on the visited icon
  async function buttonAddToVisited(activity: any) {
    const date = new Date();
    const res = await handleAddToVisited(
      context.humspotUser?.userID as string,
      id,
      date.toISOString()
    );
    if (res && !res.removed) {
      setIsVisited(true);
    }
    if (res && res.removed) {
      setIsVisited(false);
    }
  }

  // fetchVisited runs on load, check if this activity is already visited
  useEffect(() => {
    fetchVisited();
  }, [fetchVisited]);
  // clickOnVisited grabs the input and hands it to buttonAddToVisited
  function clickOnVisited(): void {
    buttonAddToVisited(activity);
  }
  return (
    <IonButton
      className="VisitedButton"
      fill="clear"
      color={"secondary"}
      size="large"
      id="VisitedButton"
      onClick={() => clickOnVisited()}
    >
      <IonIcon slot="icon-only" icon={isVisited ? walk : walkOutline}></IonIcon>
    </IonButton>
  );
};

export default ActivityVisitedButton;
