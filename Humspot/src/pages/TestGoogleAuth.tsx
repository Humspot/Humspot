import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonPage,
  useIonLoading,
} from "@ionic/react";
import {
  handleAddAttraction,
  handleAddComment,
  handleAddEvent,
  handleAddImages,
  handleAddToFavorites,
  handleAddToRSVP,
  handleAddToVisited,
  // handleGetCommentsGivenUserID,
  handleGetEventGivenTag,
  handleGetFavoritesGivenUserID,
  handleGetVisitedGivenUserID,
  handleGoogleLoginAndVerifyAWSUser,
  handleLogout,
} from "../utils/server";
import { useContext } from "../utils/my-context";
import { HumspotAttraction, HumspotCommentSubmit, HumspotEvent } from "../utils/types";
import { EngineParameters, getJson } from "serpapi";

// const event10: HumspotEvent = {
//   name: "",
//   description: "Ring in the New Year with a spectacular fireworks display, live music, and a midnight toast!",
//   location: "Waterfront Dr, Eureka, CA 95501",
//   addedByUserID: "715d07c9d97dde03808d03bb",
//   latitude: 40.807520,
//   longitude: -124.163489,
//   date: "2023-12-31",
//   time: "21:00",
//   organizer: "dy45",
//   tags: ["new year", "party", "fireworks"],
//   photoUrls: [],
// };

// const dummyAttraction: HumspotAttraction = {
//   name: "NEW ATTRACTION AT HUMBOLDT",
//   description: "This is a test attraction, go there now!",
//   location: "2023 Humspot Ave, Arcata, CA 95521",
//   addedByUserID: "715d07c9d97dde03808d03bb",
//   websiteUrl: "https://www.google.com",
//   latitude: 39.879700737622106,
//   longitude: -122.28785508438247,
//   openTimes: "9am to 9pm",
//   tags: ["attractionTest", "anotherAttractionTest", "fun"],
//   photoUrls: [],
// };

// const dummyComment: HumspotCommentSubmit = {
//   userID: "",
//   activityID: "a2dd8d5d6c746ac2654a16f6c",
//   commentDate: "2023-10-20",
//   commentText: "This is gonna be my first New Year's Party, so excited",
// };

const TestGoogleAuth: React.FC = () => {
  const context = useContext();

  const [present, dismiss] = useIonLoading();

  // TEST FUNCTIONS (preferably run these in order! And check the console log for stuff - David)

  const handleLogin = async () => {
    if (context.humspotUser) return; // if user is already logged in
    present({ duration: 0, message: "Logging in..." });
    await handleGoogleLoginAndVerifyAWSUser();
    dismiss();
  };

  const handleTestAddEvent = async () => {
    const test: HumspotEvent = {
      name: 'First Gen. College Celebration 2023',
      description: 'Library 209 - Library Fishbowl Tuesday, November 7, 2023, 10 – 11:30am Conducting research is part of the training required to become a STEM professional or successfully be accepted to a graduate degree program. Research Experiences for Undergraduates (REU) provide summer-long intensive research experiences for STEM majors. If funded by the National Science Foundation (NSF) they often come with a stipend, housing, sometimes food and travel to the site. Find out how to search for an REU, how to decipher what they are looking for in an applicant, and discover what pieces you will need to apply. Event Title: 1st GEN workshop: Why an REU is right for you! Organization: UPWARD BOUND TRIO PROGRAM, MCNAIR SCHOLARS TRIO PROGRAM Categories: Featured Event Is this event open to public?: FALSE Responsible Person at Event Name: Gema Quiroz Torres',
      addedByUserID: 'HSUSchoolEventsScraper',
      websiteURL: 'https://humboldt.edu/events/featured?trumbaEmbed=view%3devent%26eventid%3d1024770554',
      date: '2023-11-07',
      tags: ['HSU', 'School', 'Cal Poly Humboldt'],
      location: '',
      time: '',
      latitude: null,
      longitude: null,
      organizer: '',
      photoUrls: []
    };
    handleAddEvent(test);
  };

  const handleTestGetEventGivenTag = async () => {
    const res = await handleGetEventGivenTag(1, "fun");
  };

  const handleTestImages = async () => {
    if (!context.humspotUser) return;
    // const addImageRes = await handleAddImages("activityphotos", `event-photos/${context.humspotUser.userID}`);
    // if (addImageRes.photoUrls?.length < 0) {
    //   console.log("Something went wrong when uploading photos!");
    // }

    // event10.photoUrls = addImageRes.photoUrls ?? [];
    // const res = await handleAddEvent(event10);
    // console.log(res);
  };

  const handleTestFavorite = async (activityID: string) => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    const res = handleAddToFavorites(userID, activityID);
  };

  const handleTestVisited = async (activityID: string) => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    const res = handleAddToVisited(userID, activityID, "2023-09-10"); // figure out how to handle dates! (IonDatePicker?)
  };

  const handleTestComment = async () => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    // dummyComment.userID = userID;
    // const res = handleAddComment(dummyComment);
  };

  const handleTestGetComments = async () => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    // const res = await handleGetCommentsGivenUserID(1, userID);
  };

  const handleTestGetFavorites = async () => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    const res = await handleGetFavoritesGivenUserID(1, userID);
  };

  const handleTestGetVisited = async () => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    const res = await handleGetVisitedGivenUserID(1, userID);
  };

  async function handleTestAddAttraction() {
    // const res = await handleAddAttraction(dummyAttraction);
  }

  const handleTestRSVP = async () => {
    if (!context.humspotUser) return;
    const userID: string = context.humspotUser.userID;
    const res = await handleAddToRSVP(userID, '08d4f2112bb9d001127b76614', '2023-11-01');
  }

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              <>
                <p>
                  Currently logged in as:{" "}
                </p>

                <IonButton
                  color="dark"
                  onClick={async () => await handleLogin()}
                >
                  Login
                </IonButton>

                <IonButton color='primary'>
                  Test notification: 715d07c9d97dde03808d03bb
                </IonButton>

                <IonButton
                  color="dark"
                  // /* REMOVE DISABLED TO TEST */ disabled
                  onClick={async () => await handleTestAddEvent()}
                >
                  TEST SUBMIT EVENT (Change Dummy Event Variable)
                </IonButton>

                <IonButton
                  color="dark"
                  // /* REMOVE DISABLED TO TEST */ disabled
                  onClick={async () => await handleTestAddAttraction()}
                >
                  TEST SUBMIT ATTRACTION (Change Dummy Attraction Variable)
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestGetEventGivenTag()}
                >
                  TEST GET EVENTS GIVEN TAG
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestImages()}
                >
                  Test Image Upload
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () =>
                    await handleTestFavorite("08d4f2112bb9d001127b76614")
                  }
                >
                  Test Favorite ActivityID 08d4f2112bb9d001127b76614
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () =>
                    await handleTestVisited("08d4f2112bb9d001127b76614")
                  }
                >
                  Test Visited
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestComment()}
                >
                  Test comment
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestGetComments()}
                >
                  Get current users comments as a list
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestGetFavorites()}
                >
                  Get current users favorites as a list
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestGetVisited()}
                >
                  Get current users places visited as a list
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleTestRSVP()}
                >
                  Add to RSVP
                </IonButton>

                <IonButton
                  color="dark"
                  onClick={async () => await handleLogout()}
                >
                  Logout
                </IonButton>
              </>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
};

export default TestGoogleAuth;
