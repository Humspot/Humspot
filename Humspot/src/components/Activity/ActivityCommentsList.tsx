/**
 * @file ActivityCommentsList.tsx
 * @fileoverview handles rendering of comments list in a specific activity.
 */

import { memo, useRef, useState } from "react";
import { IonAvatar, IonNote, IonList, IonItem, IonLabel, IonRow, IonFab, useIonRouter, IonCardTitle, IonCardHeader, IonButton, IonIcon, IonButtons, IonContent, IonHeader, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast, useIonAlert } from "@ionic/react";
import { chevronBackOutline, warningOutline } from "ionicons/icons";

import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";

import avatar from "../../assets/images/avatar.svg";

import { HumspotCommentResponse, ReportedUser } from "../../utils/types";
import { formatDate } from "../../utils/functions/formatDate";
import useContext from "../../utils/hooks/useContext";
import { handleClickOnReportButton } from "../../utils/server";


type ActivityCommentsList = {
  comments: HumspotCommentResponse[];
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
  const [loading, setLoading] = useState<boolean>(false);

  const clickOnReport = async (comment: HumspotCommentResponse) => {
    const u: ReportedUser = {
      userID: comment.userID,
      activityID: comment.activityID,
      username: comment.username
    };
    setReportedUser(u);
    modalRef.current && modalRef.current.present();
  };

  const handleReport = async (comment: HumspotCommentResponse) => {
    const u: ReportedUser = {
      userID: comment.userID,
      activityID: comment.activityID,
      username: comment.username
    };
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Report / Block',
      message: `Are you sure you want to report / block ${u.username}?`,
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

  const handleBlockUser = async () => {

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
            <IonFab horizontal="end" vertical="bottom" onClick={async () => await handleReport(comment)}>
              <IonButton size='small' fill='clear' color='danger'><IonIcon icon={warningOutline} /></IonButton>
            </IonFab>
            <IonItem className='comment-list-item' lines="none" style={{ '--background': 'var(--ion-background-color)' }}>
              <IonLabel class="ion-text-wrap">
                <IonRow>
                  <IonAvatar class="activity-comment-avatar">
                    <img src={comment.profilePicURL ?? avatar} onClick={() => router.push("/user/" + comment.userID)} />
                  </IonAvatar>
                  <p className='activity-comment-username'> {comment.username} </p>
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
      <IonModal ref={modalRef} presentingElement={props.page}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-content'>
            <IonTitle className='profile-modal-title'>Report / Block</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => { setReportedUser(null); modalRef.current?.dismiss() }}>
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
            <IonButton color='danger' disabled={loading} className="profile-edit-modal-update-button" onClick={handleBlockUser} expand="block">Block User</IonButton>
          </section>
        </IonContent>
      </IonModal>
    </>
  );

});

export default ActivityCommentsList;