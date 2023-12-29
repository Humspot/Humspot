import { IonCard, IonCardContent, IonIcon, IonTextarea, useIonLoading, IonFab, IonFabButton, IonCardHeader, IonCardTitle, IonCol, IonRow } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { handleAddComment } from "../../utils/server";
import { useContext } from "../../utils/hooks/useContext";
import { HumspotCommentSubmit } from "../../utils/types";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useToast } from "@agney/ir-toast";
import { arrowUpOutline, banOutline, cameraOutline } from "ionicons/icons";
import { Keyboard, KeyboardResize, KeyboardResizeOptions } from "@capacitor/keyboard";
import { timeout } from "../../utils/functions/timeout";

const resizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.None,
}

const defaultResizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.Body,
}

const ActivityAddCommentBox = (props: { id: string, activityName: string; setComments: React.Dispatch<React.SetStateAction<any[]>>; }) => {

  const id: string = props.id;
  const Toast = useToast();
  const context = useContext();
  const [present, dismiss] = useIonLoading();
  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [blob, setBlob] = useState<Blob | null>(null);

  const [kbHeight, setKbHeight] = useState<number>(0);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

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
      const toast = Toast.create({ message: "Please enter a comment", position: 'top', duration: 2000, color: 'danger' });
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
      scrollToElement('top-of-comments-list');
      commentRef.current.value = null;
      setPhoto(undefined);
    } else {
      const t = Toast.create({ message: "Something went wrong!", duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  };

  useEffect(() => {
    timeout(500).then(() => {
      setIsVisible(true);
    })
    Keyboard.addListener('keyboardWillShow', info => {
      Keyboard.setResizeMode(resizeOptions);
      setKbHeight(info.keyboardHeight);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      Keyboard.setResizeMode(defaultResizeOptions);
      setKbHeight(0);
    });
    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  return (
    <IonFab className='activity-comment-textarea'
      style={context.darkMode ?
        { opacity: isVisible ? 1 : 0, bottom: `${kbHeight}px`, border: '2px solid #282828' }
        : { opacity: isVisible ? 1 : 0, bottom: `${kbHeight}px`, border: '2px solid #e6e6e6' }}
      slot="fixed"
      vertical="bottom"
      edge
    >
      {context.humspotUser &&
        <IonFab horizontal="end" vertical="top">
          <IonRow>
            <IonCol>
              {photo &&
                <img className="comment-img-submit" src={photo} />
              }
            </IonCol>
            <IonFabButton size="small" onClick={handleSubmitComment} style={{ transform: "translateY(-25%)" }}>
              <IonIcon icon={arrowUpOutline} size="small" />
            </IonFabButton>
          </IonRow>
          <IonRow>
            <IonCol></IonCol>
            {!photo ?
              <IonFabButton size="small" onClick={handleSelectImage} style={{ transform: "translateY(-25%)" }}>
                <IonIcon icon={cameraOutline} size="small" />
              </IonFabButton>
              :
              <IonFabButton onClick={() => { setPhoto(undefined); setBlob(null) }} size="small" style={{ transform: "translateY(-45%)" }}>
                <IonIcon size="small" icon={banOutline} />
              </IonFabButton>
            }
          </IonRow>
        </IonFab>

      }
      <IonTextarea
        color='primary'
        style={{
          borderColor: '#eee',
          borderWidth: '1px',
          borderRadius: '4px',
          marginBottom: '10px',
          paddingRight: "10px",
          paddingLeft: '10px',
          marginLeft: 0,
          fontSize: '14px',
          width: "70%",
          color: "var(--ion-color-dark)"
        }}
        placeholder={
          context.humspotUser
            ? "Add a comment..."
            : "Log in to add comments."
        }
        rows={5}
        ref={commentRef}
        debounce={50}
        enterkeyhint="send"
        inputMode="text"
        spellcheck={true}
        maxlength={200}
      />

    </IonFab>
  );
};

export default ActivityAddCommentBox;