/**
 * @file Activity.tsx
 * @fileoverview the information page that displays when clicking on an activity (event / attraction).
 */
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleGetActivity, handleGetCommentsGivenActivityID } from "../utils/server";

import GoBackHeader from "../components/Shared/GoBackHeader";
import ActivityHeaderTitle from "../components/Activity/ActivityHeaderTitle";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityFavoriteVisitedRSVPButtons from "../components/Activity/ActivityFavoriteVisitedRSVPButton";

import { HumspotActivity, HumspotCommentResponse } from "../utils/types";
import { useContext } from "../utils/hooks/useContext";
import { updateRecentlyViewed } from "../utils/functions/updateRecentlyViewed";

import '../components/Activity/Activity.css';
import ActivityHeader from "../components/Activity/ActivityHeader";
import ActivityTagsList from "../components/Activity/ActivityTagsList";
import ActivityDescription from "../components/Activity/ActivityDescription";
import ActivityCommentsList from "../components/Activity/ActivityCommentsList";
import { isPastDate } from "../utils/functions/calcDates";
import { formatDate } from "../utils/functions/formatDate";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

type ActivityPageParams = {
  id: string;
};

const Activity = () => {
  const params = useParams<ActivityPageParams>();
  const id: string = params.id;

  const context = useContext();
  const page = useRef();

  const [hasSwipedIn, setHasSwipedIn] = useState<boolean>(false);

  const [activity, setActivity] = useState<HumspotActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState<boolean>(true);

  const [comments, setComments] = useState<HumspotCommentResponse[]>([]);

  const [pageNum, setPageNum] = useState<number>(2);

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
        <GoBackHeader title={''} translucent={false} buttons={<ActivityFavoriteVisitedRSVPButtons id={id} activityType={activity?.activityType} activityDate={activity?.date} />} />
      }
      <IonContent fullscreen>
        {!hasSwipedIn &&
          <GoBackHeader title={''} translucent={false} />
        }

        <ActivityHeader activityType={activity?.activityType ?? ''} activityLoading={activityLoading} photoUrls={activity?.photoUrls || ''} />

        <ActivityHeaderTitle page={page.current} id={id} activity={activity ? true : false} activityType={activity?.activityType} avgRating={activity?.avgRating} name={activity?.name} />

        {activity && "tags" in activity &&
          <ActivityTagsList tags={activity.tags} />
        }

        {activity && activity.date && isPastDate(formatDate(activity.date ?? null)) &&
          <FadeIn>
            <p className='ion-text-left' style={{ color: 'var(--ion-color-danger)', fontWeight: '700', paddingLeft: '15px' }}>The date for this event has passed. Check out other upcoming events!</p>
          </FadeIn>
        }

        {activity &&
          <ActivityDateTimeLocation name={activity.name} date={activity.date} location={activity.location} latitude={activity.latitude} longitude={activity.longitude} />
        }

        {activity &&
          <ActivityDescription description={activity.description} websiteURL={activity.websiteURL} openTimes={activity.openTimes} />
        }

        <ActivityAddCommentBox id={id} activityName={activity?.name ?? 'X'} setComments={setComments} />

        {comments && comments.length > 0 &&
          <>
            <div id='top-of-comments-list'></div>
            <br />
            <ActivityCommentsList comments={comments} />
          </>
        }

        <IonInfiniteScroll
          onIonInfinite={async (ev) => {
            const response = await handleGetCommentsGivenActivityID(id, pageNum);
            if (response.success && response.comments && response.comments.length > 0) {
              setPageNum((prev) => prev + 1);
              setComments((prev) => [...(prev), ...(response.comments as HumspotCommentResponse[])]);
            }
            ev.target.complete();
          }}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <div style={{ height: "15vh" }} />

      </IonContent>
    </IonPage >
  );
}

export default Activity;
