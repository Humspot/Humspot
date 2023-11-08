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
import { handleGetActivity } from "../utils/server";
import { useContext } from "../utils/my-context";

import placeholder from "../assets/images/placeholder.png";
import { useToast } from "@agney/ir-toast";
import ActivityFavoriteButton from "../components/Activity/ActivityFavoriteButton";
import ActivityVisitedButton from "../components/Activity/ActivityVisitedButton";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityCommentsSection from "../components/Activity/ActivityCommentsSection";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import ActivityRSVPButton from "../components/Activity/ActivityRSVPButton";
function ActivityPage() {
  const { id }: any = useParams();
  const [activity, setActivity] = useState<any>(null);

  const handleGetActivityCallback = useCallback(async (id: string) => {
    const res = await handleGetActivity(id);
    if ("activity" in res && res.activity) setActivity(res.activity);
  }, []);
  useEffect(() => {
    if (id) handleGetActivityCallback(id);
  }, [id]);

  return (
    <>
      <IonPage>
        <IonContent>
          {/* Favorites Button */}
          <ActivityFavoriteButton
            activity={activity}
            id={id}
          ></ActivityFavoriteButton>
          {/* Visited Button, does not display for Events */}
          {activity?.activityType == "event" ? null : (
            <ActivityVisitedButton activity={activity} id={id} />
          )}
          {/* RSVP Button, does not display for locations */}
          {activity?.activityType == "attraction" ? null : (
            <ActivityRSVPButton activity={activity} id={id} />
          )}
          {/* Header Image */}
          <div className="headerDiv">
            <Swiper modules={[Autoplay]} autoplay={{ delay: 4000 }}>
              {activity?.photoUrls &&
                activity?.photoUrls?.split(",").map((url: any, index: any) => (
                  <SwiperSlide key={index} className="fill-frame-image">
                    <img
                      alt="Attraction Image"
                      src={url || placeholder}
                      loading="lazy"
                      className="headerImage"
                    ></img>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

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
