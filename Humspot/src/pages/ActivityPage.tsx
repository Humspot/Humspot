// Activity Page
// This page loads when you press an activity entry from any of the other pages

import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonImg,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonText,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import "./ActivityPage.css";
import { useCallback, useEffect, useState } from "react";
import { handleAddRating, handleGetActivity } from "../utils/server";

import avatar from "../assets/images/avatar.svg";


import placeholder from "../assets/images/school_placeholder.jpeg";
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
import { Preferences } from "@capacitor/preferences";
import { updateRecentlyViewed } from "../utils/updateRecentlyViewed";
import { formatDate } from "../utils/formatDate";

type ActivityPageParams = {
  id: string;
};

function ActivityPage() {
  const params = useParams<ActivityPageParams>();
  const id: string = params.id;
  const context = useContext();
  const router = useIonRouter();

  const [hasSwipedIn, setHasSwipedIn] = useState<boolean>(false);

  const [activity, setActivity] = useState<HumspotActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);

  const [comments, setComments] = useState<any[]>([]);

  const handleGetActivityCallback = useCallback(async (id: string) => {
    setActivityLoading(true);
    const res = await handleGetActivity(id);
    if ("activity" in res && res.activity) { setActivity(res.activity); setComments(res.activity.comments); }
    setActivityLoading(false);
    await updateRecentlyViewed(id, res.activity?.name ?? '', res.activity?.description ?? '', res.activity?.date ?? '', res.activity?.photoUrls ?? '');
    context.setRecentlyViewedUpdated(true);
  }, [id]);
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
    <IonPage>

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

        <ActivityHeaderTitle id={id} activity={activity ? true : false} activityType={activity?.activityType} avgRating={activity?.avgRating} name={activity?.name} />
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
            <IonText color={"light"}>
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

        <>
          {comments ? (
            <IonCard style={{ padding: '10px' }}>
              <IonCardHeader>
                <IonCardTitle>Comments</IonCardTitle>
              </IonCardHeader>
              {comments.map((comment: { profilePicURL: any; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; commentText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; photoUrl: string | undefined; commentDate: string | null; }, index: React.Key | null | undefined) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <div style={{ width: "25%" }}>
                    <IonAvatar style={{ marginRight: '15px' }}>
                      <IonImg src={comment.profilePicURL || avatar} alt="Profile Picture" />
                    </IonAvatar>
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{comment.username}</div>
                    <IonText style={{ color: '#666', fontSize: '14px' }}>{comment.commentText}</IonText>
                    {comment.photoUrl && <img src={comment.photoUrl} alt="Comment Attachment" style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '4px' }} />}
                    <IonNote style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#999' }}>
                      {formatDate(comment.commentDate)}
                    </IonNote>
                  </div>
                </div>
              ))}
            </IonCard>
          ) : (
            <IonCard>
              <IonCardContent>
                <IonSkeletonText animated style={{ margin: '10px 0' }} />
                <IonSkeletonText animated style={{ margin: '10px 0' }} />
                <IonSkeletonText animated style={{ margin: '10px 0' }} />
              </IonCardContent>
            </IonCard>
          )}
        </>

        {/* Add a Comment Box */}
        <ActivityAddCommentBox id={id} activityName={activity?.name ?? 'X'} setComments={setComments}></ActivityAddCommentBox>
      </IonContent>
    </IonPage>
  );
}

export default ActivityPage;
