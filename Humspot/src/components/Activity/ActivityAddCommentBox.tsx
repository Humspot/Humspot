import { IonCard, IonCardContent, IonIcon, IonTextarea, useIonLoading, IonFab, IonFabButton } from "@ionic/react";
import { useRef, useState } from "react";
import { handleAddComment } from "../../utils/server";
import { useContext } from "../../utils/hooks/useContext";
import { HumspotCommentSubmit } from "../../utils/types";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useToast } from "@agney/ir-toast";
import { arrowUpOutline, cameraOutline } from "ionicons/icons";

const ActivityAddCommentBox = (props: { id: string, activityName: string; setComments: React.Dispatch<React.SetStateAction<any[]>>; }) => {
  
  const id: string = props.id;
  const Toast = useToast();
  const context = useContext();
  const [present, dismiss] = useIonLoading();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [blob, setBlob] = useState<Blob | null>(null);

  const handleSelectImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Prompt,
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

  const handleSubmitComment = async () => {
    if (!context.humspotUser) return;
    if (!commentRef || !commentRef.current || !commentRef.current.value?.trim()) {
      const toast = Toast.create({ message: "Please enter a comment", duration: 2000, color: 'danger' });
      toast.present();
      return;
    }

    await present({ message: "Uploading comment..." });

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
      const addToCommentsArray = {
        commentText: commentRef.current.value as string,
        userID: context.humspotUser.userID,
        activityID: id,
        photoUrl: photo ?? null,
        profilePicURL: context.humspotUser.profilePicURL,
        username: context.humspotUser.username,
        commentDate: (new Date().toISOString()),
      };
      props.setComments((prev) => [addToCommentsArray, ...prev]);
      commentRef.current.value = null;
      setPhoto(undefined);
    } else {
      const t = Toast.create({ message: "Something went wrong!", duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  };

  return (
    <>
      <IonCard style={{ padding: '10px' }} className='activity-card'>
        <IonCardContent className='ion-no-margin ion-no-padding' style={{ padding: "2.5px" }}>
          <IonTextarea
            style={{
              borderColor: '#eee',
              borderWidth: '1px',
              borderRadius: '4px',
              marginBottom: '10px',
              paddingRight: "5px",
              paddingLeft: 0,
              marginLeft: 0,
              fontSize: '14px',
              width: "70%"
            }}
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
            maxlength={200}
            disabled={!context.humspotUser}
          ></IonTextarea>
          {photo &&
            <img src={photo} style={{ marginTop: '10px', maxWidth: '100%', borderRadius: '4px' }} />
          }
          {context.humspotUser &&
            <IonFab vertical="top" horizontal="end" slot="fixed" style={{ display: 'flex', alignItems: 'center', paddingTop: "2.5%" }}>
              <IonFabButton color='secondary' onClick={handleSubmitComment} style={{ marginRight: '10px', width: '40px', height: '40px', '--padding-start': 0, '--padding-end': 0 }}>
                <IonIcon icon={arrowUpOutline} size='small' />
              </IonFabButton>
              <IonFabButton color='secondary' onClick={handleSelectImage} style={{ width: '40px', height: '40px', '--padding-start': 0, '--padding-end': 0 }}>
                <IonIcon icon={cameraOutline} size='small' style={{ margin: 0 }} />
              </IonFabButton>
            </IonFab>
          }

        </IonCardContent>
      </IonCard>
    </>
  );
};

export default ActivityAddCommentBox;