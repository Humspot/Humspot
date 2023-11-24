// Activity Page
// This page loads when you press an activity entry from any of the other pages

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonLoading,
  IonPage,
  IonSkeletonText,
  IonText,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import "./ActivityPage.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleAddRating, handleGetActivity } from "../utils/server";

import placeholder from "../assets/images/placeholder.png";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityCommentsSection from "../components/Activity/ActivityCommentsSection";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import "swiper/css/autoplay";
import { HumspotActivity } from "../utils/types";
import ActivityFavoriteVisitedRSVPButtons from "../components/Activity/ActivityFavoriteVisitedRSVPButton";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useContext } from "../utils/my-context";
import { navigateBack } from "../components/Shared/BackButtonNavigation";

import { Rating } from 'react-custom-rating-component'
import ActivityHeaderTitle from "../components/Activity/ActivityHeaderTitle";

type ActivityPageParams = {
  id: string;
};

function ActivityPage() {
  const params = useParams<ActivityPageParams>();
  const id: string = params.id;
  const context = useContext();
  const router = useIonRouter();

  const page = useRef();
  const [hasSwipedIn, setHasSwipedIn] = useState<boolean>(false);

  const [activity, setActivity] = useState<HumspotActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);

  const handleGetActivityCallback = useCallback(async (id: string) => {
    const res = await handleGetActivity(id);
    if ("activity" in res && res.activity) setActivity(res.activity);
    setActivityLoading(false);
  }, []);
  useEffect(() => {
    if (id) handleGetActivityCallback(id);
  }, [id]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useIonViewDidEnter(() => {
    setHasSwipedIn(true);
  }, [])

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, () => {
        navigateBack(router, false);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);


  return (
    <IonPage ref={page}>

      {hasSwipedIn &&
        <GoBackHeader title={''} buttons={<ActivityFavoriteVisitedRSVPButtons id={id} activityType={activity?.activityType} />} />
      }

      <IonContent>

        {!hasSwipedIn &&
          <GoBackHeader title={''} />
        }

        {/* <IonLoading isOpen={activityLoading} message={"Loading..."} /> */}

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
        <ActivityHeaderTitle page={page.current} id={id} activity={activity ? true : false} activityType={activity?.activityType} avgRating={activity?.avgRating} name={activity?.name} />
        {/* Tags */}
        <div style={{ paddingLeft: "10px" }}> {/* why is the padding different on iOS it makes no sense please help */}
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
            <IonText>
              <p>{activity?.description ?? ""}</p>
              <p>
                <a
                  href={activity?.websiteURL ?? ""}
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
        <ActivityAddCommentBox id={id} activityName={activity?.name ?? 'X'}></ActivityAddCommentBox>
      </IonContent>
    </IonPage>
  );
}

export default ActivityPage;
