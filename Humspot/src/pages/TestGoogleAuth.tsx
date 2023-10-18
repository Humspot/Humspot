import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleAddAttraction, handleAddComment, handleAddEvent, handleAddImages, handleAddToFavorites, handleAddToVisited, handleGetCommentsGivenUserID, handleGetEventGivenTag, handleGetFavoritesGivenUserID, handleGetVisitedGivenUserID, handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../server";
import { useContext } from "../my-context";
import { HumspotAttraction, HumspotComment, HumspotEvent } from "../types";

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

const dummyAttraction: HumspotAttraction = {
  name: "NEW ATTRACTION AT HUMBOLDT",
  description: "This is a test attraction, go there now!",
  location: "2023 Humspot Ave, Arcata, CA 95521",
  addedByUserID: "5e2e096461e516972e0b1ac2",
  websiteUrl: "https://www.google.com",
  latitude: 39.879700737622106,
  longitude: -122.28785508438247,
  openTimes: "9am to 9pm",
  tags: ["attractionTest", "anotherAttractionTest", "fun"],
  photoUrls: []
}

const dummyComment: HumspotComment = {
  userID: '',
  activityID: '59c7351a86b71e1b8c6693a0d',
  commentDate: '2023-10-16',
  commentText: 'WOWOWOWOWWO I cannnnnottt waitttt to go to this 🙏🏽😊'
};


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();

  // TEST FUNCTIONS (preferrably run these in order! And check the console log for stuff - David)

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

  const handleTestGetFavorites = async () => {
    const userID: string = context.humspotUser.userID;
    const res = await handleGetFavoritesGivenUserID(1, userID);
  }

  const handleTestGetVisited = async () => {
    const userID: string = context.humspotUser.userID;
    const res = await handleGetVisitedGivenUserID(1, userID);
  }

  async function handleTestAddAttraction() {
    const res = await handleAddAttraction(dummyAttraction);
  }

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              {context.humspotUser.email ?
                <>
                  <p>Currently logged in as: {JSON.stringify(context.humspotUser)}</p>

                  <IonButton color='dark' /* REMOVE DISABLED TO TEST */ disabled onClick={async () => await handleTestAddEvent()}>TEST SUBMIT EVENT (Change Dummy Event Variable)</IonButton>

                  <IonButton color='dark' /* REMOVE DISABLED TO TEST */ disabled onClick={async () => await handleTestAddAttraction()}>TEST SUBMIT ATTRACTION (Change Dummy Attraction Variable)</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestGetEventGivenTag()}>TEST GET EVENTS GIVEN TAG</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestImages()}>Test Image Upload</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestFavorite('59c7351a86b71e1b8c6693a0d')}>Test Favorite ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestVisited('59c7351a86b71e1b8c6693a0d')}>Test Visited, ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestComment()}>Test comment on ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestGetComments()}>Get current users comments as a list</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestGetFavorites()}>Get current users favorites as a list</IonButton>

                  <IonButton color='dark' onClick={async () => await handleTestGetVisited()}>Get current users places visited as a list</IonButton>


                  <IonButton color='dark' onClick={async () => await handleLogout()}>Logout</IonButton>
                </>
                :
                <>
                  <p>Currently a Guest User, login to test functions</p>
                  <IonButton color='dark' onClick={async () => await handleLogin()}>Login</IonButton>
                </>
              }

            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
};

export default TestGoogleAuth;