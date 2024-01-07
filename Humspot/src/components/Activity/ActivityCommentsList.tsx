/**
 * @file ActivityCommentsList.tsx
 * @fileoverview handles rendering of comments list in a specific activity.
 */

import { memo } from "react";
import { IonAvatar, IonNote, IonList, IonItem, IonLabel, IonRow, IonFab } from "@ionic/react";

import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";

import avatar from "../../assets/images/avatar.svg";

import { HumspotCommentResponse } from "../../utils/types";
import { formatDate } from "../../utils/functions/formatDate";



type ActivityCommentsList = {
  comments: HumspotCommentResponse[]
}

const ActivityCommentsList = memo((props: ActivityCommentsList) => {

  const comments: HumspotCommentResponse[] = props.comments;

  return (
    <>
      {
        comments.map((comment: HumspotCommentResponse, index: number) => (
          <IonList inset={true} key={comment.userID + index} style={{ marginLeft: '10px', marginRight: '10px' }}>
            <IonItem lines="none">
              <IonLabel class="ion-text-wrap">
                <IonRow>
                  <IonAvatar class="activity-comment-avatar">
                    <img src={comment.profilePicURL ?? avatar} />
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