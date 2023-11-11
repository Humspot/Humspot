// Activity Page
// This page loads when you press an activity entry from any of the other pages

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonPage,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import "./ActivityPage.css";
import { useCallback, useEffect, useState } from "react";
import { handleGetActivity } from "../utils/server";

import placeholder from "../assets/images/placeholder.png";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityCommentsSection from "../components/Activity/ActivityCommentsSection";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import "swiper/css/autoplay";
import { HumspotActivity } from "../utils/types";
import ActivityFavoriteVisitedRSVPButtons from "../components/Activity/ActivityFavoriteVisitedRSVPButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

type ActivityPageParams = {
  id: string;
};

function ActivityPage() {
  const params = useParams<ActivityPageParams>();
  const id: string = params.id;

  const [activity, setActivity] = useState<HumspotActivity | null>(null);

  const handleGetActivityCallback = useCallback(async (id: string) => {
    const res = await handleGetActivity(id);
    if ("activity" in res && res.activity) setActivity(res.activity);
  }, []);
  useEffect(() => {
    if (id) handleGetActivityCallback(id);
  }, [id]);

  return (
    <IonPage>
      <IonContent>
        <ActivityFavoriteVisitedRSVPButtons
          id={id}
          activityType={activity?.activityType}
        />

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
        <div style={{ paddingLeft: "5px" }}>
          {activity &&
            "tags" in activity &&
            activity.tags &&
            activity.tags.split(",").map((tag: string, index: number) => {
              return (
                <IonChip key={tag + index} color={"secondary"}>
                  {tag}
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
              <p>
                <a
                  href={activity?.websiteURL ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Site
                </a>
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>
        {/* Comments Section */}
        <ActivityCommentsSection activity={activity}></ActivityCommentsSection>
        {/* Add a Comment Box */}
        <ActivityAddCommentBox id={id}></ActivityAddCommentBox>
      </IonContent>
    </IonPage>
  );
}

export default ActivityPage;
