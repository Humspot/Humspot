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
        <IonCard className="commentlist">
          <IonCardHeader>
            <IonCardTitle>Comments</IonCardTitle>
          </IonCardHeader>
          {activity.comments[0] &&
            activity?.comments?.map((comment: any, index: any) => (
              <IonCard className="commentbox" key={index}>
                <IonAvatar className="commentavatar">
                  <IonImg
                    alt="Profile Picture"
                    src={comment.profilePicURL || avatar}
                  ></IonImg>
                </IonAvatar>
                <div>
                  <IonCardTitle className="commentusername">
                    {comment.username}
                  </IonCardTitle>
                  <IonCardContent className="commentcontents">
                    <IonText>{comment.commentText}</IonText>
                    {comment.photoUrl &&
                      <img src={comment.photoUrl} />
                    }
                    <IonNote className="commentdate">
                      {formatDate((comment.commentDate as string) ?? "")}
                    </IonNote>
                  </IonCardContent>
                </div>
              </IonCard>
            ))}
        </IonCard>
      ) : (
        <IonCard>
          <IonCardContent>
            <p>
              <IonSkeletonText animated></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText animated></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText animated></IonSkeletonText>
            </p>
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
};

export default ActivityCommentsSection;
