/**
 * @file ActivityAddCommentBox.tsx
 * @fileoverview the textarea at the bottom of the Activity page; has buttons to add/remove a photoa and 
 * submit a comment.
 */

import { useEffect, useRef, useState } from "react";
import { IonIcon, IonTextarea, useIonLoading, IonFab, IonFabButton, IonCol, IonRow } from "@ionic/react";
import { arrowUpOutline, banOutline, cameraOutline } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Keyboard, KeyboardResize, KeyboardResizeOptions } from "@capacitor/keyboard";
import { useToast } from "@agney/ir-toast";
import { timeout } from "../../utils/functions/timeout";
import { handleAddComment } from "../../utils/server";
import { useContext } from "../../utils/hooks/useContext";
import { HumspotCommentSubmit } from "../../utils/types";

const resizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.None,
};

const defaultResizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.Body,
};

/**
 * @description determines what border radius to give the textarea. If the user is on an iOS device
 * with a curved border, return "50px", otherwise return a more square "10px".
 * 
 * @returns {"50px" | "10px"} the border radius of the textarea.
 */
function getBorderRadius(): "50px" | "10px" {
  const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const hasTallScreen: boolean = window.screen.height / window.screen.width > 2 || window.screen.width / window.screen.height > 2;

  const hasSafeAreaInset = () => {
    const div = document.createElement('div');
    div.style.paddingTop = 'constant(safe-area-inset-top)';
    div.style.paddingTop = 'env(safe-area-inset-top)';
    document.body.appendChild(div);
    const calculatedPadding = getComputedStyle(div).paddingTop;
    document.body.removeChild(div);
    return parseFloat(calculatedPadding) > 0;
  };

  return (isIOS && hasTallScreen && hasSafeAreaInset()) ? "50px" : "10px";
};

const ActivityAddCommentBox = (props: { id: string, activityName: string; setComments: React.Dispatch<React.SetStateAction<any[]>>; }) => {

  const id: string = props.id; // the id of the activity
  const Toast = useToast();
  const context = useContext();
  const [present, dismiss] = useIonLoading();

  const commentRef = useRef<HTMLIonTextareaElement | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [blob, setBlob] = useState<Blob | null>(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [borderRadius, setBorderRadius] = useState<string>(getBorderRadius());

  /**
   * @description smoothly scrolls to a specified element's position on the screen.
   * 
   * @param {string} elementId the id of the element to scroll to
   */
  const scrollToElement = (elementId: string): void => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * @description uses the Capacitor Camera API to allow users to select an image from their gallery.
   * This image is then set and later used when submitting a comment.
   * NOTE: The image must be below 15 MB in size
   */
  const handleSelectImage = async (): Promise<void> => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Uri,
    });

    if (!image) return;
    if (!image.webPath) {
      const toast = Toast.create({ message: 'Something went wrong', position: 'bottom', duration: 2000, color: 'danger' });
      toast.present();
    }

    const res = await fetch(image.webPath!);
    const blobRes = await res.blob();
    if (blobRes) {
      if (blobRes.size > 15_000_000) { // 15 MB
        const toast = Toast.create({ message: 'Image too large', position: 'bottom', duration: 2000, color: 'danger' });
        toast.present();
        dismiss();
      } else {
        setBlob(blobRes);
        setPhoto(image.webPath);
        dismiss();
      }
    }
    dismiss();
  };

  /**
   * @description submits the user's comment. It ensures that the user has entered some text before sending.
   * Upon success it dynamically updates the existing comments array with the user's newly submitted comment.
   * @see handleAddComment
   */
  const handleSubmitComment = async (): Promise<void> => {
    if (!context.humspotUser) return;
    if (!commentRef || !commentRef.current || !commentRef.current.value?.trim()) {
      const toast = Toast.create({ message: "Please enter a comment", position: 'bottom', duration: 2000, color: 'danger' });
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
      const t = Toast.create({ message: "Comment added", position: 'bottom', duration: 2000, color: 'secondary' });
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
      const t = Toast.create({ message: "Something went wrong!", position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  };

  /**
   * @description adds a listener to dynamically update the border radius and position of the textarea
   * as the keyboard opens and closes (specific to iOS).
   */
  useEffect(() => {
    timeout(500).then(() => {
      setIsVisible(true);
    })
    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', info => {
      setBorderRadius("0px");
      const element: Element | null = document.querySelector('.activity-comment-textarea');
      if (element) {
        element.classList.remove('hide-keyboard');
      }
    });

    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setBorderRadius(getBorderRadius());
      const element: Element | null = document.querySelector('.activity-comment-textarea');
      if (element) {
        element.classList.add('hide-keyboard');
      }
    });

    return () => {
      const element: Element | null = document.querySelector('.activity-comment-textarea');
      if (element) {
        element.classList.remove('hide-keyboard');
      }

      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);


  return (
    <>
      {context.humspotUser &&
        <IonFab className='activity-comment-textarea'
          style={
            context.darkMode ?
              { opacity: isVisible ? 1 : 0, borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, border: '3px solid #373737' }
              : { opacity: isVisible ? 1 : 0, borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, border: '3px solid #e6e6e6' }}
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
            mode='ios'
            color='primary'
            style={{
              borderColor: '#eee',
              borderWidth: '1px',
              borderRadius: '1px',
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
            enterkeyhint="enter"
            inputMode="text"
            spellcheck={true}
            maxlength={500}
          />
        </IonFab>
      }
    </>
  );
};

export default ActivityAddCommentBox;