import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleAddComment, handleAddEvent, handleAddImages, handleAddToFavorites, handleAddToVisited, handleGetCommentsGivenUserID, handleGetEventGivenTag, handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../server";
import { useContext } from "../my-context";
import { HumspotComment, HumspotEvent } from "../types";

const dummyEvent: HumspotEvent = {
  name: "THIS IS A TEST 100",
  description: "This is a 100 sample description for the dummy event. It's going to be a fun time with various activities.",
  location: "1221 Harpst St, Arcata, CA 95521",
  addedByUserID: "5e2e096461e516972e0b1ac2",
  date: "2023-10-31",
  time: "16:30",
  latitude: 39.868700737622106,
  longitude: -122.08785508438247,
  organizer: "dy45",
  tags: ["test100"],
  photoUrls: []
};

const dummyComment: HumspotComment = {
  userID: '',
  activityID: '59c7351a86b71e1b8c6693a0d',
  commentDate: '2023-10-17',
  commentText: 'Wow! This is an amazing event! I cannot wait to go to this 🙏🏽😊'
};


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();

  // TEST FUNCTIONS

  /**
   * @description runs when the user clicks the login button. It ensures the user is not already logged in.
   * If not, it calls handleGoogleLoginAndVerifyAWSUser and caches authentication credentials accordingly.
   */
  const handleLogin = async () => {
    if (context.humspotUser.email) return; // if user is already logged in
    present({ duration: 0, message: "Logging in..." });
    await handleGoogleLoginAndVerifyAWSUser();
    dismiss();
  };

  const handleTestAddEvent = async () => {
    handleAddEvent(dummyEvent);
  }

  const handleTestGetEventGivenTag = async () => {
    const res = await handleGetEventGivenTag(1, "fun")
  };

  const handleTestImages = async () => {
    const addImageRes = await handleAddImages(context.humspotUser.userID);
    if (addImageRes.photoUrls?.length < 0) {
      console.log("Something went wrong when uploading photos!");
    }

    dummyEvent.photoUrls = addImageRes.photoUrls ?? [];
    const res = await handleAddEvent(dummyEvent);
    console.log(res);

  };

  const handleTestFavorite = async (activityID: string) => {
    const userID: string = context.humspotUser.userID;
    const res = handleAddToFavorites(userID, activityID);
  };

  const handleTestVisited = async (activityID: string) => {
    const userID: string = context.humspotUser.userID;
    const res = handleAddToVisited(userID, activityID, '2023-09-10'); // figure out how to handle dates! (IonDatePicker?)
  };

  const handleTestComment = async () => {
    const userID: string = context.humspotUser.userID;
    dummyComment.userID = userID;
    const res = handleAddComment(dummyComment);
  };

  const handleTestGetComments = async () => {
    const userID: string = context.humspotUser.userID;
    const res = await handleGetCommentsGivenUserID(1, userID)
  };

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              {context.humspotUser.email ?
                <>
                  <p>Currently logged in as: {JSON.stringify(context.humspotUser)}</p>
                  <IonButton color='dark' onClick={async () => await handleLogout()}>Logout</IonButton>
                </>
                :
                <>
                  <p>Currently a Guest User</p>
                  <IonButton color='dark' onClick={async () => await handleLogin()}>Login</IonButton>
                </>
              }

              <IonButton color='dark' disabled onClick={async () => await handleTestAddEvent()}>TEST SUBMIT EVENT (Change Dummy Event Variable)</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestGetEventGivenTag()}>TEST GET EVENTS GIVEN TAG</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestImages()}>Test Image Upload</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestFavorite('59c7351a86b71e1b8c6693a0d')}>Test Favorite ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestVisited('59c7351a86b71e1b8c6693a0d')}>Test Visited, ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestComment()}>Test comment on ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestGetComments()}>Get current users comments as a list</IonButton>



            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
};

export default TestGoogleAuth;