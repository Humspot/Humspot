import React from 'react';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonNote,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import { formatDate } from "../../utils/formatDate";
import avatar from "../../assets/images/avatar.svg";

const ActivityCommentsSection = (props: { activity: any }) => {
  const { activity } = props;
  return (
    <>
      {activity ? (
        <IonCard style={{ padding: '10px' }}>
          <IonCardHeader>
            <IonCardTitle>Comments</IonCardTitle>
          </IonCardHeader>
          {activity.comments.map((comment: { profilePicURL: any; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; commentText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; photoUrl: string | undefined; commentDate: string | null; }, index: React.Key | null | undefined) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <IonAvatar style={{ marginRight: '15px' }}>
                <IonImg src={comment.profilePicURL || avatar} alt="Profile Picture" />
              </IonAvatar>
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
  );
};

export default ActivityCommentsSection;
