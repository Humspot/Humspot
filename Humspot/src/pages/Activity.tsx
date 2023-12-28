/**
 * @file Activity.tsx
 * @fileoverview the information page that displays when clicking on an activity (event / attraction).
 */
import {
  IonContent,
  IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleGetActivity } from "../utils/server";

import GoBackHeader from "../components/Shared/GoBackHeader";
import ActivityHeaderTitle from "../components/Activity/ActivityHeaderTitle";
import ActivityAddCommentBox from "../components/Activity/ActivityAddCommentBox";
import ActivityDateTimeLocation from "../components/Activity/ActivityDateTimeLocation";
import ActivityFavoriteVisitedRSVPButtons from "../components/Activity/ActivityFavoriteVisitedRSVPButton";

import { HumspotActivity } from "../utils/types";
import { useContext } from "../utils/hooks/useContext";
import { updateRecentlyViewed } from "../utils/functions/updateRecentlyViewed";

import '../components/Activity/Activity.css';
import ActivityHeader from "../components/Activity/ActivityHeader";
import ActivityTagsList from "../components/Activity/ActivityTagsList";
import ActivityDescription from "../components/Activity/ActivityDescription";
import ActivityCommentsList from "../components/Activity/ActivityCommentsList";

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

        {activity &&
          <ActivityHeader activityLoading={activityLoading} photoUrls={activity.photoUrls} />
        }
        <ActivityHeaderTitle page={page.current} id={id} activity={activity ? true : false} activityType={activity?.activityType} avgRating={activity?.avgRating} name={activity?.name} />

        {activity && "tags" in activity &&
          <ActivityTagsList tags={activity.tags} />
        }

        <ActivityDateTimeLocation activity={activity} />

        {activity &&
          <ActivityDescription description={activity.description} websiteURL={activity.websiteURL} />
        }

        {comments && comments.length > 0 &&
          <ActivityCommentsList comments={comments} />
        }

        <ActivityAddCommentBox id={id} activityName={activity?.name ?? 'X'} setComments={setComments} />

      </IonContent>
    </IonPage>
  );
}

export default Activity;
