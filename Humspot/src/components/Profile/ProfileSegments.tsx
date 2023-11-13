import { IonSegment, IonSegmentButton, IonIcon, IonLabel, IonCard, IonCardContent, IonList, IonItem, IonThumbnail, useIonRouter, IonSkeletonText, IonContent, IonTitle } from "@ionic/react";
import { people, star, walk } from "ionicons/icons";
import { memo, useCallback, useEffect, useState } from "react";
import { handleGetCommentsGivenUserID, handleGetFavoritesGivenUserID, handleGetVisitedGivenUserID } from "../../utils/server";
import { HumspotCommentResponse, HumspotFavoriteResponse, HumspotVisitedResponse } from "../../utils/types";
import { useContext } from "../../utils/my-context";
import { useToast } from "@agney/ir-toast";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

import placeholder from '../../assets/images/placeholder.png';

import './Profile.css';
import { formatDate } from "../../utils/formatDate";
import SkeletonLoading from "../Shared/SkeletonLoading";

const ProfileSegments: React.FC = memo(() => {

  const context = useContext();
  const Toast = useToast();
  const router = useIonRouter();

  const [selectedSegment, setSelectedSegment] = useState<string>("favorites");

  const [favorites, setFavorites] = useState<HumspotFavoriteResponse[]>([]);
  const [visited, setVisited] = useState<HumspotVisitedResponse[]>([]);
  const [comments, setComments] = useState<HumspotCommentResponse[]>([]);

  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [visitedLoading, setVisitedLoading] = useState<boolean>(true);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

  const fetchFavorites = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetFavoritesGivenUserID(1, context.humspotUser.userID);
    if (!response.success) {
      const toast = Toast.create({ message: response.message, duration: 2000, color: 'danger' });
      toast.present();
    }
    setFavorites(response.favorites);
    setFavoritesLoading(false);
  }, [context.humspotUser]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const fetchVisited = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetVisitedGivenUserID(1, context.humspotUser.userID);
    if (!response.success) {
      const toast = Toast.create({ message: response.message, duration: 2000, color: 'danger' });
      toast.present();
    }
    setVisited(response.visited);
    setVisitedLoading(false);
  }, [context.humspotUser]);

  useEffect(() => {
    fetchVisited();
  }, [fetchVisited]);

  const fetchComments = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetCommentsGivenUserID(1, context.humspotUser.userID);
    if (!response.success) {
      const toast = Toast.create({ message: response.message, duration: 2000, color: 'danger' });
      toast.present();
    }
    setComments(response.comments);
    setCommentsLoading(false);
  }, [context.humspotUser]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <IonSegment style={{ paddingLeft: "2.5%", paddingRight: "2.5%" }} value={selectedSegment} onIonChange={(e) => { setSelectedSegment(e.detail.value as string) }}>

        <IonSegmentButton value="favorites">
          <div className="segment-button" style={{ fontSize: "0.8rem" }}>
            <IonIcon
              icon={star}
              style={{ margin: "5%" }}
              size="large"
            ></IonIcon>
            <IonLabel>Favorites</IonLabel>
          </div>
        </IonSegmentButton>

        <IonSegmentButton value="visited" className="segment-button" style={{ fontSize: "0.8rem" }}>
          <div className="segment-button">
            <IonIcon
              icon={walk}
              style={{ margin: "5%" }}
              size="large"
            ></IonIcon>
            <IonLabel>Visited</IonLabel>
          </div>
        </IonSegmentButton>

        <IonSegmentButton value="interactions" className="segment-button" style={{ fontSize: "0.7rem" }}>
          <div className="segment-button">
            <IonIcon
              icon={people}
              style={{ margin: "5%" }}
              size="large"
            ></IonIcon>
            <IonLabel>Interactions</IonLabel>
          </div>
        </IonSegmentButton>

      </IonSegment>

      <div style={{height : "0.75vh"}} />

      <IonContent>

        {selectedSegment === "favorites" ? (
          <>
            {!favoritesLoading && favorites.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "100%" }}>No Favorites</IonTitle>
              :
              <IonCard>
                <IonCardContent>
                  <IonList>
                    {!favoritesLoading ?
                      favorites.map((favorite: HumspotFavoriteResponse, index: number) => {
                        return (
                          <FadeIn key={favorite.name + index} delay={index * 50}>
                            <IonItem className='ion-no-padding' role='button' onClick={() => { if (favorite.activityID) router.push("/activity/" + favorite.activityID) }}>
                              <IonThumbnail><img src={favorite.photoUrl || placeholder} /></IonThumbnail>
                              <IonLabel style={{ paddingLeft: "10px" }}>
                                <h2>{favorite.name}</h2>
                                <p style={{ fontSize: "0.9rem" }}>{favorite.description}</p>
                                <p style={{ fontSize: "0.8rem" }}>{favorite.location}</p>
                              </IonLabel>
                            </IonItem>
                          </FadeIn>
                        )
                      })
                      :
                      <SkeletonLoading count={4} animated={true} height={"5rem"} />
                    }
                  </IonList>
                </IonCardContent>
              </IonCard>
            }
          </>
        ) : selectedSegment === "visited" ? (
          <>
            {!visitedLoading && visited.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "100%" }}>No Places Visited</IonTitle>
              :
              <IonCard>
                <IonCardContent>
                  <IonList>
                    {!visitedLoading ?
                      visited.map((visitedPlace: HumspotVisitedResponse, index: number) => {
                        return (
                          <FadeIn key={visitedPlace.name + index} delay={index * 50}>
                            <IonItem className='ion-no-padding' role='button' onClick={() => { if (visitedPlace.activityID) router.push("/activity/" + visitedPlace.activityID) }}>
                              <IonThumbnail><img src={visitedPlace.photoUrl || placeholder} /></IonThumbnail>
                              <IonLabel style={{ paddingLeft: "10px" }}>
                                <h2>{visitedPlace.name}</h2>
                                <p style={{ fontSize: "0.9rem" }}>{visitedPlace.description}</p>
                                <p style={{ fontSize: "0.8rem" }}>{visitedPlace.location}</p>
                              </IonLabel>
                            </IonItem>
                          </FadeIn>
                        )
                      })
                      :
                      <SkeletonLoading count={4} animated={true} height={"5rem"} />
                    }
                  </IonList>
                </IonCardContent>
              </IonCard>
            }
          </>
        ) : (
          <>
            {!commentsLoading && comments.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "100%" }}>No Comments or Interactions</IonTitle>
              :
              <IonCard>
                <IonCardContent>
                  <IonList>
                    {!commentsLoading ?
                      comments.map((comment: HumspotCommentResponse, index: number) => {
                        return (
                          <FadeIn key={comment.name + index} delay={index * 50}>
                            <IonItem className='ion-no-padding' role='button' onClick={() => { if (comment.activityID) router.push("/activity/" + comment.activityID) }}>
                              <IonThumbnail><img src={comment.photoUrl || placeholder} /></IonThumbnail>
                              <IonLabel style={{ paddingLeft: "10px" }}>
                                <h2>{comment.name}</h2>
                                <p style={{ fontSize: "0.9rem" }}><b>You commented:</b> {comment.commentText}</p>
                                <p style={{ fontSize: "0.8rem" }}>{formatDate(comment.commentDate as string)}</p>
                              </IonLabel>
                            </IonItem>
                          </FadeIn>
                        )
                      })
                      :
                      <SkeletonLoading count={4} animated={true} height={"5rem"} />
                    }
                  </IonList>
                </IonCardContent>
              </IonCard>
            }
          </>
        )
        }
      </IonContent>
    </>
  );
});

export default ProfileSegments;