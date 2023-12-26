/**
 * @file Activity.tsx
 * @fileoverview the information page that displays when clicking on an activity (event / attraction).
 */
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
import { useCallback, useEffect, useRef, useState } from "react";
import { handleGetActivity } from "../utils/server";

import avatar from "../assets/images/avatar.svg";

import placeholder from "../assets/images/placeholder.jpeg"
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import "swiper/css/autoplay";
import { HumspotActivity } from "../utils/types";
import ActivityFavoriteVisitedRSVPButtons from "../components/Activity/ActivityFavoriteVisitedRSVPButton";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useContext } from "../utils/hooks/useContext";

import ActivityHeaderTitle from "../components/Activity/ActivityHeaderTitle";
import { updateRecentlyViewed } from "../utils/functions/updateRecentlyViewed";
import { formatDate } from "../utils/functions/formatDate";

import '../components/Activity/Activity.css';

type ActivityPageParams = {
  id: string;
};

const Activity = () => {
  const params = useParams<ActivityPageParams>();
  const id: string = params.id;
  const context = useContext();
  const router = useIonRouter();

  const page = useRef();

  const [hasSwipedIn, setHasSwipedIn] = useState<boolean>(false);

  const [activity, setActivity] = useState<HumspotActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);

  const [comments, setComments] = useState<any[]>([]);

  const fetchActivity = useCallback(async (id: string) => {
    setActivityLoading(true);
    const res = await handleGetActivity(id);
    if ("activity" in res && res.activity) {
      setActivity(res.activity); setComments(res.activity.comments);
      await updateRecentlyViewed(id, res.activity?.name ?? '', res.activity?.description ?? '', res.activity?.date ?? '', res.activity?.photoUrls ?? '');
      context.setRecentlyViewedUpdated(true);
    }
    setActivityLoading(false);
  }, [id]);
  useEffect(() => {
    if (id) fetchActivity(id);
  }, [id]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useIonViewDidEnter(() => {
    setHasSwipedIn(true);
  }, []);

  return (
    <IonPage ref={page}>

      {hasSwipedIn &&
        <GoBackHeader title={''} buttons={context.humspotUser && <ActivityFavoriteVisitedRSVPButtons id={id} activityType={activity?.activityType} />} />
      }

      <IonContent>

        {!hasSwipedIn &&
          <GoBackHeader title={''} />
        }

        <div style={{ width: "100%", height: "30vh", position: "absolute", overflow: "hidden", zIndex: 0 }}>
          <Swiper modules={[Autoplay, Navigation]} navigation autoplay={{ delay: 2500 }}>
            {activityLoading ?
              <SwiperSlide>
                <IonSkeletonText style={{ height: "200px" }} animated />
              </SwiperSlide>
              :
              activity?.photoUrls ?
                activity?.photoUrls?.split(",").map((url: any, index: any) => (
                  <SwiperSlide key={index} >
                    <IonCard className='ion-no-padding ion-no-margin' style={{ width: "100vw", marginRight: "5px", marginLeft: "5px" }}>
                      <img
                        alt="Attraction Image"
                        src={url || ''}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </IonCard>
                  </SwiperSlide>
                ))
                :
                <SwiperSlide>
                  <IonCard className='ion-no-padding ion-no-margin' style={{ width: "100vw" }}>
                    <img
                      alt="Attraction Image"
                      src={placeholder}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </IonCard>
                </SwiperSlide>
            }
          </Swiper>
        </div>

        <ActivityHeaderTitle page={page.current} id={id} activity={activity ? true : false} activityType={activity?.activityType} avgRating={activity?.avgRating} name={activity?.name} />

        <div style={{ paddingLeft: "10px" }}>
          {activity &&
            "tags" in activity &&
            activity.tags &&
            activity.tags.split(",").map((tag: string, index: number) => {
              return (
                <IonChip key={tag + index} color={"secondary"} onClick={() => { router.push(`/more-results/${tag.trim()}`) }}>
                  {tag}
                </IonChip>
              );
            })}
        </div>

        <ActivityDateTimeLocation activity={activity} />

        <IonCard>
          <IonCardContent>
            <IonText>
              <p>{activity?.description ?? ""}</p>
              <br />
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
          {comments && comments.length > 0 && (
            <IonCard style={{ padding: '10px' }}>
              <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingTop: "5px", paddingBottom: "15px" }}>
                <IonCardTitle style={{ fontSize: "1.25rem" }} className='ion-no-padding ion-no-margin'>Comments</IonCardTitle>
              </IonCardHeader>
              {comments.map((comment: any, index: number) => (
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
                    <IonNote style={{ display: 'block', marginTop: '15px', fontSize: '12px', color: '#999' }}>
                      {formatDate(comment.commentDate)}
                    </IonNote>
                  </div>
                </div>
              ))}
            </IonCard>
          )
          }
        </>

        <ActivityAddCommentBox id={id} activityName={activity?.name ?? 'X'} setComments={setComments} />

      </IonContent>
    </IonPage>
  );
}

export default Activity;