/**
 * @file ActivityCommentsList.tsx
 * @fileoverview handles rendering of comments list in a specific activity.
 */

import { memo } from "react";
import { IonAvatar, IonNote, IonList, IonItem, IonLabel, IonRow, IonFab, useIonRouter, IonCardTitle, IonCardHeader } from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";

import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";

import avatar from "../../assets/images/avatar.svg";

import { HumspotCommentResponse } from "../../utils/types";
import { formatDate } from "../../utils/functions/formatDate";


type ActivityCommentsList = {
  comments: HumspotCommentResponse[]
}

const ActivityCommentsList = memo((props: ActivityCommentsList) => {

  const comments: HumspotCommentResponse[] = props.comments;
  const router = useIonRouter();

  return (
    <>
      {comments && comments.length &&
        <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Comments</IonCardTitle>
        </IonCardHeader>
      }
      {
        comments.map((comment: HumspotCommentResponse, index: number) => (
          <IonList key={comment.userID + index} >
            <IonItem className='comment-list-item' lines="none" style={{ '--background': 'var(--ion-background-color)' }}>
              <IonLabel class="ion-text-wrap">
                <IonRow>
                  <IonAvatar class="activity-comment-avatar">
                    <img src={comment.profilePicURL ?? avatar} onClick={() => router.push("/user/" + comment.userID)} />
                  </IonAvatar>
                  <p className='activity-comment-username'> {comment.username} </p>
                </IonRow>
                <div className='activity-comment-text'>
                  {comment.commentText}
                </div>
                {comment.photoUrl &&
                  <>
                    <br></br>
                    <div className="activity-comment-image">
                      <IonPhotoViewer
                        title={`${comment.username}'s Photo`}
                        icon={chevronBackOutline}
                        src={comment.photoUrl}
                      >
                        <img src={comment.photoUrl} alt={`${comment.username}'s photo`} />
                      </IonPhotoViewer>
                    </div>
                  </>
                }
              </IonLabel>
              <IonFab vertical="top" horizontal="end">
                <IonNote style={{ fontSize: "0.75em" }}>
                  {formatDate(comment.commentDate)}
                </IonNote>
              </IonFab>
              <div></div>
            </IonItem>
          </IonList >
        )
        )
      }
    </>
  );

});

export default ActivityCommentsList;