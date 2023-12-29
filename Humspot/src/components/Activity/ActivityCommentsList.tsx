import { IonCard, IonCardHeader, IonCardTitle, IonAvatar, IonImg, IonText, IonNote, IonCardContent } from "@ionic/react";
import { formatDate } from "../../utils/functions/formatDate";
import avatar from "../../assets/images/avatar.svg";

type ActivityCommentsList = {
  comments: any[];
}

const ActivityCommentsList = (props: ActivityCommentsList) => {

  const comments = props.comments;

  return (
    <IonCard className='activity-card'>
      <IonCardContent>
        <IonCardHeader id='top-of-comments-list' className='ion-no-padding ion-no-margin' style={{ paddingBottom: "10px" }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Comments</IonCardTitle>
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
      </IonCardContent>
    </IonCard>
  );
};

export default ActivityCommentsList;