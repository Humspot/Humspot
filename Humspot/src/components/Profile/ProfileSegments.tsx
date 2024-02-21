/**
 * @file ProfileSegments.tsx
 * @fileoverview the 3 segments buttons on the profile page. Contains the user's favorites, places visited, and the user's interactions
 * (comments and RSVPs). Users can swipe down to pull the latest data from all three segments' info.
 */

import { memo, useCallback, useEffect, useState } from "react";
import { IonSegment, IonSegmentButton, IonIcon, IonLabel, IonCard, IonCardContent, IonList, IonItem, IonThumbnail, useIonRouter, IonContent, IonTitle, IonRefresher, RefresherEventDetail, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import { heart, people, walk } from "ionicons/icons";

import { useToast } from "@agney/ir-toast";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

import placeholder from '../../assets/images/school_placeholder.jpeg';

import { useContext } from "../../utils/hooks/useContext";
import { formatDate } from "../../utils/functions/formatDate";
import { HumspotInteractionResponse, HumspotFavoriteResponse, HumspotVisitedResponse } from "../../utils/types";
import { handleGetInteractionsGivenUserID, handleGetFavoritesGivenUserID, handleGetVisitedGivenUserID } from "../../utils/server";

import SkeletonLoading from "../Shared/SkeletonLoading";

import './Profile.css';


const ProfileSegments: React.FC = memo(() => {

  const context = useContext();
  const Toast = useToast();
  const router = useIonRouter();

  const [selectedSegment, setSelectedSegment] = useState<string>("favorites");

  const [favorites, setFavorites] = useState<HumspotFavoriteResponse[]>([]);
  const [visited, setVisited] = useState<HumspotVisitedResponse[]>([]);
  const [interactions, setInteractions] = useState<HumspotInteractionResponse[]>([]);

  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(true);
  const [visitedLoading, setVisitedLoading] = useState<boolean>(true);
  const [interactionsLoading, setInteractionsLoading] = useState<boolean>(true);

  const [favoritesPageCount, setFavoritesPageCount] = useState<number>(2);
  const [visitedPageCount, setVisitedPageCount] = useState<number>(2);
  const [interactionsPageCount, setInteractionsPageCount] = useState<number>(2);

  const fetchFavorites = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetFavoritesGivenUserID(1, context.humspotUser.userID);
    if (!response.success) {
      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
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
      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
      toast.present();
    }
    setVisited(response.visited);
    setVisitedLoading(false);
  }, [context.humspotUser]);

  useEffect(() => {
    fetchVisited();
  }, [fetchVisited]);

  const fetchInteractions = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetInteractionsGivenUserID(1, context.humspotUser.userID);
    if (!response.success) {
      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
      toast.present();
    }
    setInteractions(response.interactions);
    setInteractionsLoading(false);
  }, [context.humspotUser]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => { // called when user swipes down on page
    await fetchFavorites();
    await fetchInteractions();
    await fetchVisited();
    event.detail.complete();
  }

  return (
    <>
      <IonSegment id='profile-segment' value={selectedSegment} onIonChange={(e) => { setSelectedSegment(e.detail.value as string) }}>

        <IonSegmentButton value="favorites">
          <div className="segment-button" style={{ fontSize: "0.8rem" }}>
            <IonIcon
              icon={heart}
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

      </IonSegment >

      <div style={{ height: '7.5px' }} />

      <IonContent>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {selectedSegment === "favorites" ? (
          <>
            {!favoritesLoading && favorites.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "50%" }}>No Favorites</IonTitle>
              :
              <>
                <IonCard style={{ marginTop: 0 }}>
                  <IonCardContent className='ion-no-padding'>
                    <IonList inset={false} style={{ paddingTop: 0, paddingBottom: 0 }}>
                      {!favoritesLoading ?
                        favorites.map((favorite: HumspotFavoriteResponse, index: number) => {
                          return (
                            <FadeIn key={favorite.name + index} delay={(index % 10) * 50}>
                              <IonItem button className='ion-no-padding' role='button' onClick={() => { if (favorite.activityID) router.push("/activity/" + favorite.activityID) }}>
                                <IonThumbnail style={{ marginLeft: "10px", marginBottom: '7.5px' }}><img style={{ borderRadius: "5px" }} src={favorite.photoUrl || placeholder} /></IonThumbnail>
                                <IonLabel style={{ paddingLeft: "10px", margin: 0 }}>
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
                <IonInfiniteScroll
                  onIonInfinite={async (ev) => {
                    if (!context.humspotUser) return;
                    const response = await handleGetFavoritesGivenUserID(favoritesPageCount, context.humspotUser.userID);
                    if (!response.success) {
                      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
                      toast.present();
                    } else {
                      setFavoritesPageCount((prev) => prev + 1);
                      setFavorites((prev) => [...prev, ...response.favorites]);
                    }
                    ev.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </>
            }
          </>
        ) : selectedSegment === "visited" ? (
          <>
            {!visitedLoading && visited.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "50%" }}>No Places Visited</IonTitle>
              :
              <>
                <IonCard style={{ marginTop: 0 }}>
                  <IonCardContent className='ion-no-padding'>
                    <IonList inset={false} style={{ paddingTop: 0, paddingBottom: 0 }}>
                      {!visitedLoading ?
                        visited.map((visitedPlace: HumspotVisitedResponse, index: number) => {
                          return (
                            <FadeIn key={visitedPlace.name + index} delay={(index % 10) * 50}>
                              <IonItem button className='ion-no-padding' role='button' onClick={() => { if (visitedPlace.activityID) router.push("/activity/" + visitedPlace.activityID) }}>
                                <IonThumbnail style={{ marginLeft: "10px", marginBottom: '7.5px' }}><img style={{ borderRadius: "5px" }} src={visitedPlace.photoUrl || placeholder} /></IonThumbnail>
                                <IonLabel style={{ paddingLeft: "10px", margin: 0 }}>
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
                <IonInfiniteScroll
                  onIonInfinite={async (ev) => {
                    if (!context.humspotUser) return;
                    const response = await handleGetVisitedGivenUserID(visitedPageCount, context.humspotUser.userID);
                    if (!response.success) {
                      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
                      toast.present();
                    } else {
                      setVisitedPageCount((prev) => prev + 1);
                      setVisited((prev) => [...prev, ...response.visited]);
                    }
                    ev.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </>
            }
          </>
        ) : (
          <>
            {!interactionsLoading && interactions.length === 0 ?
              <IonTitle className="ion-text-center" style={{ display: "flex", height: "50%" }}>No Interactions</IonTitle>
              :
              <>
                <IonCard style={{ marginTop: 0 }}>
                  <IonCardContent className='ion-no-padding'>
                    <IonList inset={false} style={{ paddingTop: 0, paddingBottom: 0 }}>
                      {!interactionsLoading ?
                        interactions.map((interaction: HumspotInteractionResponse, index: number) => {
                          return (
                            <FadeIn key={interaction.name + index} delay={(index % 20) * 50}>
                              <IonItem button className='ion-no-padding' role='button' onClick={() => { if (interaction.activityID) router.push("/activity/" + interaction.activityID) }}>
                                <IonThumbnail style={{ marginLeft: "10px", marginBottom: '7.5px' }}><img style={{ borderRadius: "5px" }} src={interaction.photoUrl || placeholder} /></IonThumbnail>
                                <IonLabel style={{ paddingLeft: "10px", margin: 0 }}>
                                  <h2>{interaction.name}</h2>
                                  {interaction.interactionType === 'comment' ?
                                    <>
                                      <p style={{ fontSize: "0.9rem" }}><b>You commented:</b> {interaction.interactionText}</p>
                                      <p style={{ fontSize: "0.8rem" }}>{formatDate(interaction.interactionDate as string)}</p>
                                    </>
                                    :
                                    <p style={{ fontSize: "0.9rem" }}><b>You RSVP'd</b> for this event</p>
                                  }
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
                <IonInfiniteScroll
                  onIonInfinite={async (ev) => {
                    if (!context.humspotUser) return;
                    const response = await handleGetInteractionsGivenUserID(interactionsPageCount, context.humspotUser.userID);
                    if (!response.success) {
                      const toast = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: 'danger' });
                      toast.present();
                    } else {
                      setInteractionsPageCount((prev) => prev + 1);
                      setInteractions((prev) => [...prev, ...response.interactions]);
                    }
                    ev.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </>
            }
          </>
        )
        }
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </IonContent>
    </>
  );
});

export default ProfileSegments;