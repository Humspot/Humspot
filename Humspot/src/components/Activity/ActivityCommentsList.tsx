import { IonAvatar, IonNote, IonList, IonItem, IonLabel, IonRow, IonFab } from "@ionic/react";
import { useToast } from "@agney/ir-toast";
import avatar from "../../assets/images/avatar.svg";

import { HumspotCommentResponse } from "../../utils/types";
import { formatDate } from "../../utils/functions/formatDate";
import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";

type ActivityCommentsList = {
  comments: HumspotCommentResponse[]
}

const ActivityCommentsList = (props: ActivityCommentsList) => {

  const Toast = useToast();

  const comments: HumspotCommentResponse[] = props.comments;
  console.log(comments);

  return (
    <>
      {
        comments.map((comment: HumspotCommentResponse, index: number) => (
          <IonList inset={true} key={comment.userID + index} style={{ marginLeft: '10px', marginRight: '10px' }}>
            {" "}
            <IonItem lines="none">
              <IonLabel class="ion-text-wrap">
                <IonRow>
                  <IonAvatar class="activity-comment-avatar"
                  >
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
                    <div
                      className="activity-comment-image"
                      style={{ borderRadius: '10px' }}
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   if(!comment.photoUrl) return;
                    //   console.log(encodeURIComponent(comment.photoUrl));
                    //   const img: CapacitorImage = {
                    //     url: encodeURIComponent(comment.photoUrl),
                    //     title: `${comment.username}'s comment`
                    //   };
                    //   console.log(img);
                    //   CapacitorPhotoViewer.show({
                    //     options: {
                    //       title: true
                    //     },
                    //     images: [img],
                    //     mode: 'one',
                    //   }).catch((err) => {
                    //     const toast = Toast.create({ message: 'Unable to open image', position: 'top', duration: 2000, color: 'danger' });
                    //     toast.present();
                    //   });
                    // }}
                    >
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

};

export default ActivityCommentsList;