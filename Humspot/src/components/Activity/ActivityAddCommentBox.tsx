import { IonButton, IonCard, IonCardContent, IonIcon, IonTextarea, useIonLoading } from "@ionic/react";
import { useRef, useState } from "react";
import { handleAddComment } from "../../utils/server";
import { useContext } from "../../utils/my-context";
import { HumspotCommentSubmit } from "../../utils/types";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useToast } from "@agney/ir-toast";
import { cameraOutline } from "ionicons/icons";

const ActivityAddCommentBox = (props: { id: string, activityName: string }) => {
  const id: string = props.id;
  const Toast = useToast();
  const context = useContext();
  const [present, dismiss] = useIonLoading();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [blob, setBlob] = useState<Blob | null>(null);

  const handleSelectImage = async () => {
    present({ message: "Loading..." });
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      // source: CameraSource.Prompt, uncomment when on iOS / Android
      resultType: CameraResultType.Uri,
    });

    if (!image) return;
    if (!image.webPath) {
      const toast = Toast.create({ message: 'Something went wrong', duration: 2000, color: 'danger' });
      toast.present();
    }

    const res = await fetch(image.webPath!);
    const blobRes = await res.blob();
    if (blobRes) {
      if (blobRes.size > 15_000_000) { // 15 MB
        const toast = Toast.create({ message: 'Image too large', duration: 2000, color: 'danger' });
        toast.present();
        dismiss();
      } else {
        setBlob(blobRes);
        setPhoto(image.webPath);
        dismiss();
      }
    }
    dismiss();
  }

  // handSubmitComment Function
  const handleSubmitComment = async () => {
    if (!context.humspotUser) return;
    if (!commentRef || !commentRef.current || !commentRef.current.value?.trim()) {
      const toast = Toast.create({ message: "Please enter a comment", duration: 2000, color: 'danger' });
      toast.present();
      return;
    }

    present({ message: "Uploading comment..." });

    const humspotComment: HumspotCommentSubmit = {
      commentText: commentRef.current.value as string,
      userID: context.humspotUser.userID,
      activityID: id,
      photoUrl: photo ?? null
    };
    const res = await handleAddComment(humspotComment, blob, props.activityName);
    if (res.success) {
      const t = Toast.create({ message: "Comment added", duration: 2000, color: 'success' });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong!", duration: 2000, color: 'danger' });
      t.present();
    }
    dismiss();
  };

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
          {photo &&
            <img src={photo} />
          }
          <IonButton
            onClick={handleSubmitComment}
            disabled={!context.humspotUser}
          >
            {context.humspotUser ? "Submit Comment" : "Log in to add comments."}
          </IonButton>
          <IonButton
            onClick={async () => await handleSelectImage()}
          >
            <IonIcon icon={cameraOutline} />
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default ActivityAddCommentBox;
