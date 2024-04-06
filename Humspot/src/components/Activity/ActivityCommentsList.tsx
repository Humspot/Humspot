/**
 * @file ActivityCommentsList.tsx
 * @fileoverview handles rendering of comments list in a specific activity.
 */

import { memo, useRef, useState } from "react";
import { IonAvatar, IonNote, IonList, IonItem, IonLabel, IonRow, IonFab, useIonRouter, IonCardTitle, IonCardHeader, IonButton, IonIcon, IonButtons, IonContent, IonHeader, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast, useIonAlert, IonActionSheet, useIonActionSheet, useIonLoading } from "@ionic/react";
import { chevronBackOutline, ellipsisHorizontal, warningOutline } from "ionicons/icons";

import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";

import avatar from "../../assets/images/avatar.svg";

import { HumspotCommentResponse, ReportedUser } from "../../utils/types";
import { formatDate } from "../../utils/functions/formatDate";
import useContext from "../../utils/hooks/useContext";
import { handleBlockUser, handleClickOnReportButton, handleDeleteComment } from "../../utils/server";


type ActivityCommentsList = {
  comments: HumspotCommentResponse[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  page: any;
}

const ActivityCommentsList = memo((props: ActivityCommentsList) => {

  const comments: HumspotCommentResponse[] = props.comments;
  const router = useIonRouter();
  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const context = useContext();
  const [reportedUser, setReportedUser] = useState<ReportedUser | null>(null);
  const [details, setDetails] = useState<string>('');
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [presentActionSheet] = useIonActionSheet();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [loading, setLoading] = useState<boolean>(false);

  const handleReport = async (comment: HumspotCommentResponse) => {
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Report / Block',
      message: `Are you sure you want to report / block ${comment.username}?`,
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            text: 'Report',
            id: 'click-on-report',
            cssClass: 'alert-cancel-button',
            handler: async () => {
              await clickOnReport(comment);
            },
          },
        ]
    });
  };

  const clickOnReport = async (comment: HumspotCommentResponse) => {
    const u: ReportedUser = {
      userID: comment.userID,
      activityID: comment.activityID,
      username: comment.username
    };
    setReportedUser(u);
    modalRef.current && modalRef.current.present();
  };

  const handleReportUser = async () => {
    if (!details || details.trim().length <= 0) {
      presentToast({ message: 'Please provide a reason why', color: 'danger', duration: 2000 });
      return;
    }
    if (context.humspotUser && reportedUser) {
      setLoading(true);
      const res = await handleClickOnReportButton(context.humspotUser.userID, context.humspotUser.email, reportedUser.userID, '', details, reportedUser.activityID);
      if (res.success) {
        presentToast({ message: 'Report sent successfully', color: 'secondary', duration: 2000 });
      } else {
        presentToast({ message: 'Something went wrong', color: 'danger', duration: 2000 });
      }
      setLoading(false);
    }
  };

  const clickOnDeleteComment = async (commentID: string) => {
    if (!context.humspotUser) return;
    await presentLoading({ message: "Deleting..." });
    const res = await handleDeleteComment(context.humspotUser.userID, commentID);
    if (res.success) {
      const newComments: any[] = [];
      for (let i = 0; i < comments.length; ++i) {
        if (comments[i].commentID !== commentID) {
          newComments.push(comments[i]);
        }
      }
      props.setComments(newComments);
      presentToast({ message: "Comment deleted", duration: 2000, color: 'secondary' });
    } else {
      presentToast({ message: "Something went wrong!", duration: 2000, color: 'danger' });
    }
    await dismissLoading();
  };

  const handleShowDeleteCommentAlert = async (commentID: string) => {
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Delete Comment',
      message: `Are you sure you want to delete your comment?`,
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            text: 'Delete',
            id: 'click-on-report',
            cssClass: 'alert-cancel-button',
            handler: async () => {
              await clickOnDeleteComment(commentID);
            },
          },
        ]
    });
  };

  const handleShowActionSheet = async (comment: HumspotCommentResponse) => {
    if (!context.humspotUser) return;
    if (comment.userID !== context.humspotUser.userID) {
      await presentActionSheet(({
        header: `${comment.username}'s Comment`,
        buttons: [
          {
            text: 'View Profile',
            handler: async () => {
              router.push(`/user/${comment.userID}`)
            },
          },
          {
            text: 'Report / Block',
            role: 'destructive',
            data: {
              action: 'delete',
            },
            handler: async () => {
              await handleReport(comment);
            }
          },
          {
            text: 'Cancel',
            role: 'destructive',
            data: {
              action: 'cancel',
            },
          },
        ],
      }));
    } else {
      await presentActionSheet(({
        header: `${comment.username}'s Comment`,
        buttons: [
          {
            text: 'View Profile',
            handler: async () => {
              router.push(`/user/${comment.userID}`)
            },
          },
          {
            text: 'Delete Comment',
            data: {
              action: 'delete'
            },
            role: 'destructive',
            handler: async () => {
              await handleShowDeleteCommentAlert(comment.commentID);
            },
          },
          {
            text: 'Cancel',
            role: 'destructive',
            data: {
              action: 'cancel',
            },
          },
        ],
      }));
    }
  };

  const handleClickOnBlockUser = async () => {
    if (!context.humspotUser || !reportedUser) return;
    await presentLoading({ message: "Blocking..." });
    const res = await handleBlockUser(context.humspotUser.userID, reportedUser.userID)
    if (res.success) {
      presentToast({ message: 'Successfully blocked user', color: 'secondary', duration: 2000 });
    } else {
      presentToast({ message: 'Something went wrong', color: 'danger', duration: 2000 });
    }
    await dismissLoading();
  };

  return (
    <>
      {comments && comments.length &&
        <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Comments</IonCardTitle>
        </IonCardHeader>
      }
      {
        comments.map((comment: HumspotCommentResponse, index: number) => (
          <IonList key={comment.userID + index} >
            <IonItem className='comment-list-item' lines="none" style={{ '--background': 'var(--ion-background-color)' }}>
              <IonLabel class="ion-text-wrap">
                <IonRow>
                  <IonAvatar class="activity-comment-avatar">
                    <img src={comment.profilePicURL ?? avatar} onClick={() => router.push("/user/" + comment.userID)} />
                  </IonAvatar>
                  <p className='activity-comment-username'> {comment.username.length >= 25 ? comment.username.substring(0, 25) + '...' : comment.username} <IonNote style={{ fontSize: '0.75rem' }}> - {formatDate(comment.commentDate)}</IonNote></p>
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
                        icon={chevronBackOutline}
                        src={comment.photoUrl}
                      >
                        <img src={comment.photoUrl} alt={`${comment.username}'s photo`} />
                      </IonPhotoViewer>
                    </div>
                  </>
                }
              </IonLabel>
              <IonFab vertical="top" horizontal="end" style={{ paddingTop: '20px' }}>
                <IonIcon onClick={async () => { handleShowActionSheet(comment) }} icon={ellipsisHorizontal} />
              </IonFab>
              <div></div>
            </IonItem>
          </IonList>
        )
        )
      }
      <IonModal ref={modalRef} presentingElement={props.page} onDidDismiss={() => setReportedUser(null)}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-content'>
            <IonTitle className='profile-modal-title'>Report / Block</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => { modalRef.current?.dismiss() }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className='profile-modal-content' scrollY={false}>
          <section >
            <p style={{ paddingLeft: '20px', paddingRight: '20px' }}>You are reporting {reportedUser ? reportedUser.username : ' a user'}, please provide a reason below</p>
            <IonTextarea style={{ padding: '20px' }} onIonInput={(e) => setDetails(e.detail.value as string)} placeholder="This user is not being nice! ..." rows={3}> </IonTextarea>
            <IonButton color='danger' disabled={loading} className="profile-edit-modal-update-button" onClick={handleReportUser} expand="block">Report</IonButton>
            <p style={{ fontSize: '0.9rem' }} className='ion-text-center'><IonNote className='ion-text-center'><span>OR</span></IonNote></p>
            <IonButton color='danger' disabled={loading} className="profile-edit-modal-update-button" onClick={handleClickOnBlockUser} expand="block">Block User</IonButton>
          </section>
        </IonContent>
      </IonModal>
    </>
  );

});

export default ActivityCommentsList;