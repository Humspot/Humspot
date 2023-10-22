import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonText,
  IonTextarea,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./attraction.css";
import { Map, Marker } from "pigeon-maps";
import {
  compass,
  mapOutline,
  pin,
  pinOutline,
  star,
  starOutline,
  time,
  trailSign,
  trailSignOutline,
  walkOutline,
} from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleAddComment, handleGetEvent } from "../utils/server";
import { useContext } from "../utils/my-context";
import avatar from "../elements/avatar.svg";
import placeholder from "../elements/placeholder.png";
import { formatDate } from "../utils/formatDate";
import { useToast } from "@agney/ir-toast";
import { timeout } from "../utils/timeout";
import { HumspotCommentSubmit } from "../utils/types";
import { object } from "prop-types";

export function LocationMap(props: any) {
  console.log(props);
  return (
    <Map
      defaultCenter={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      defaultZoom={12}
      minZoom={12}
      maxZoom={12}
      height={120}
      width={120}
      attribution={false}
      mouseEvents={false}
      touchEvents={false}
    >
      <Marker
        width={30}
        height={30}
        anchor={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      />
    </Map>
  );
}

function AttractionPage() {
  const { id, imgsrc }: any = useParams();
  const [activity, setActivity] = useState<any>(null);
  const context = useContext();
  const Toast = useToast();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  const handleSubmitComment = async () => {
    if (!context.humspotUser) return;
    if (!commentRef || !commentRef.current || !commentRef.current.value) return;
    const date = new Date();
    const humspotcomment = {
      commentText: commentRef.current.value as string,
      commentDate: date.toISOString(),
      userID: context.humspotUser.userID,
      activityID: activity.activityID,
      profilePicURL: context.humspotUser.profilePicURL,
      username: context.humspotUser.username,
    };
    const res = await handleAddComment(humspotcomment);
    if (res.success) {
      setActivity((prevActivity: any) => ({
        ...prevActivity,
        comments: [humspotcomment, ...prevActivity.comments],
      }));
      commentRef.current.value = "";
    }
  };
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

  function clickOnFavorite(): void {
    throw new Error("Function not implemented.");
  }

  function clickOnVisited(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <IonPage>
        <IonContent>
          {/* Favorites Button */}
          <IonButton
            className="FavoritesButton"
            fill="clear"
            color={"secondary"}
            size="large"
            id="FavoritesButton"
            onClick={() => clickOnFavorite()}
          >
            <IonIcon slot="icon-only" icon={starOutline}></IonIcon>
          </IonButton>
          {/* Visited Button for Locations */}
          <IonButton
            className="VisitedButton"
            fill="clear"
            color={"secondary"}
            size="large"
            id="VisitedButton"
            onClick={() => clickOnVisited()}
          >
            <IonIcon slot="icon-only" icon={walkOutline}></IonIcon>
          </IonButton>
          <IonImg
            alt="Attraction Image"
            src={activity?.photoUrl || placeholder}
            className="MainCarouselEntryHeaderImage"
            style={imgStyle as any}
          ></IonImg>
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
          <div>
            {activity &&
              "tags" in activity &&
              activity.tags.split(",").map((tag: string, index: number) => {
                return (
                  <IonChip key={tag + index} color={"secondary"}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                  </IonChip>
                );
              })}
          </div>

          <IonCard>
            {activity ? (
              <IonCardContent className="locationcard">
                <IonText color={"dark"}>
                  <div className="locationlabel">
                    <IonIcon icon={compass} size="small"></IonIcon>
                    <h2>{activity?.location ?? ""}</h2>
                  </div>
                  <div className="locationlabel">
                    <IonIcon icon={time} size="small"></IonIcon>
                    <h2>{formatDate(activity?.date ?? "")}</h2>
                  </div>
                </IonText>

                <div className="locationmap">
                  {activity && (
                    <LocationMap
                      latitude={activity.latitude}
                      longitude={activity.longitude}
                    />
                  )}
                </div>
              </IonCardContent>
            ) : (
              <IonCardContent>
                <p>
                  <IonSkeletonText animated></IonSkeletonText>
                </p>
                <p>
                  <IonSkeletonText animated></IonSkeletonText>
                </p>
              </IonCardContent>
            )}
          </IonCard>
          <IonCard>
            <IonCardContent>
              <IonText color={"dark"}>
                <p>{activity?.description ?? ""}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
          {/* Comments Section */}
          {activity ? (
            <IonCard className="commentlist">
              <IonCardHeader>
                <IonCardTitle>Comments</IonCardTitle>
              </IonCardHeader>
              {activity?.comments?.map((comment: any, index: any) => (
                <IonCard className="commentbox" key={index}>
                  <IonAvatar className="commentavatar">
                    <IonImg
                      alt="Profile Picture"
                      src={comment.profilePicURL || avatar}
                    ></IonImg>
                  </IonAvatar>
                  <div>
                    <IonCardTitle className="commentusername">
                      {comment.username}
                    </IonCardTitle>
                    <IonCardContent className="commentcontents">
                      <IonText color={"dark"}>{comment.commentText}</IonText>
                      <IonNote className="commentdate">
                        {formatDate((comment.commentDate as string) ?? "")}
                      </IonNote>
                    </IonCardContent>
                  </div>
                </IonCard>
              ))}
            </IonCard>
          ) : (
            <IonCard>
              <IonCardContent>
                <p>
                  <IonSkeletonText animated></IonSkeletonText>
                </p>
                <p>
                  <IonSkeletonText animated></IonSkeletonText>
                </p>
                <p>
                  <IonSkeletonText animated></IonSkeletonText>
                </p>
              </IonCardContent>
            </IonCard>
          )}

          <IonCard>
            <IonCardContent>
              <IonTextarea
                placeholder={
                  context.humspotUser
                    ? "Add a comment..."
                    : "Log in to add comments."
                }
                rows={3}
                id="commenttextarea"
                ref={commentRef}
                debounce={50}
                enterkeyhint="send"
                inputMode="text"
                spellcheck={true}
                disabled={!context.humspotUser}
              ></IonTextarea>
              <IonButton
                onClick={handleSubmitComment}
                disabled={!context.humspotUser}
              >
                {context.humspotUser
                  ? "Submit Comment"
                  : "Log in to add comments."}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}

export default AttractionPage;
