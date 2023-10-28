// Activity Page
// This page loads when you press an activity entry from any of the other pages

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonImg,
  IonPage,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import "./ActivityPage.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleGetEvent } from "../utils/server";
import { useContext } from "../utils/my-context";

import placeholder from "../elements/placeholder.png";
import { useToast } from "@agney/ir-toast";
import ActivityFavoriteButton from "../components/Activity/ActivityFavoriteButton";
import ActivityVisitedButton from "../components/Activity/ActivityVisitedButton";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityCommentsSection from "../components/Activity/ActivityCommentsSection";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";

function ActivityPage() {
  const { id }: any = useParams();
  const [activity, setActivity] = useState<any>(null);
  const context = useContext();
  const Toast = useToast();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);

  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "30vh", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
    position: "absolute",
    opacity: "0.85",
  };

  const handleGetEventCallback = useCallback(async (id: string) => {
    const res = await handleGetEvent(id);
    if ("event" in res && res.event) setActivity(res.event);
  }, []);
  useEffect(() => {
    if (id) handleGetEventCallback(id);
  }, [id]);

  function clickOnVisited(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <IonPage>
        <IonContent>
          {/* Favorites Button */}
          <ActivityFavoriteButton activity={activity}></ActivityFavoriteButton>
          {/* Visited Button, does not display for Events */}
          {activity?.eventID ? null : <ActivityVisitedButton />}
          {/* Header Image */}
          <IonImg
            alt="Attraction Image"
            src={activity?.photoUrl || placeholder}
            className="MainCarouselEntryHeaderImage"
            style={imgStyle as any}
          ></IonImg>
          {/* Header Title */}
          <IonCard color={"primary"} className="headercard">
            <IonCardHeader>
              {activity ? (
                <IonCardTitle>
                  {activity && <h1>{activity.name}</h1>}
                </IonCardTitle>
              ) : (
                <IonCardTitle>
                  <IonSkeletonText animated></IonSkeletonText>
                </IonCardTitle>
              )}
            </IonCardHeader>
          </IonCard>
          {/* Tags */}
          <div>
            {activity &&
              "tags" in activity &&
              activity.tags &&
              activity.tags.split(",").map((tag: string, index: number) => {
                return (
                  <IonChip key={tag + index} color={"secondary"}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                  </IonChip>
                );
              })}
          </div>
          {/* Date Time Location */}
          <ActivityDateTimeLocation
            activity={activity}
          ></ActivityDateTimeLocation>
          {/* Description */}
          <IonCard>
            <IonCardContent>
              <IonText color={"dark"}>
                <p>{activity?.description ?? ""}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
          {/* Comments Section */}
          <ActivityCommentsSection
            activity={activity}
          ></ActivityCommentsSection>
          {/* Add a Comment Box */}
          <ActivityAddCommentBox activity={activity}></ActivityAddCommentBox>
        </IonContent>
      </IonPage>
    </>
  );
}

export default ActivityPage;
