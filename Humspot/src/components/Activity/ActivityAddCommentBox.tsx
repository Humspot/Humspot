import { IonButton, IonCard, IonCardContent, IonTextarea } from "@ionic/react";
import { useRef } from "react";
import { handleAddComment } from "../../utils/server";
import { useContext } from "../../utils/my-context";

const ActivityAddCommentBox = (props: { activity: any }) => {
  const context = useContext();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  // handSubmitComment Function
  const handleSubmitComment = async () => {
    if (!context.humspotUser) return;
    if (!commentRef || !commentRef.current || !commentRef.current.value) return;
    const date = new Date();
    const humspotcomment = {
      commentText: commentRef.current.value as string,
      commentDate: date.toISOString(),
      userID: context.humspotUser.userID,
      activityID: activity.activityID,
      profilePicURL: context.humspotUser.profilePicURL,
      username: context.humspotUser.username,
    };
    const res = await handleAddComment(humspotcomment);
    if (res.success) {
      window.location.reload();
    }
  };

  const { activity } = props;
  return (
    <>
      <IonCard>
        <IonCardContent>
          {context.humspotUser ? (
            <IonTextarea
              placeholder={
                context.humspotUser
                  ? "Add a comment..."
                  : "Log in to add comments."
              }
              rows={3}
              id="commenttextarea"
              ref={commentRef}
              debounce={50}
              enterkeyhint="send"
              inputMode="text"
              spellcheck={true}
              disabled={!context.humspotUser}
            ></IonTextarea>
          ) : (
            <></>
          )}

          <IonButton
            onClick={handleSubmitComment}
            disabled={!context.humspotUser}
          >
            {context.humspotUser ? "Submit Comment" : "Log in to add comments."}
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default ActivityAddCommentBox;
