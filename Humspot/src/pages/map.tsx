
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonIcon, IonPage, useIonRouter, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { Map as PigeonMap, Marker, Overlay, ZoomControl } from "pigeon-maps";
import { useContext } from "../utils/hooks/useContext";
import { mapTiler, zoomControlButtonsStyle, zoomControlButtonsStyleDark } from "../utils/functions/map-config";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleGetActivitiesGivenTag, handleGetThisWeeksEvents } from "../utils/server";
import { GetEventsBetweenTwoDatesStatusResponse, GetHumspotEventResponse } from "../utils/types";
import { settingsOutline } from "ionicons/icons";
import MapSettingsModal from "../components/Map/MapSettingsModal";

const Map = () => {
  const context = useContext();
  const router = useIonRouter();
  const pageRef = useRef();

  const [mapZoom, setZoom] = useState<number>(15);
  const [center, setCenter] = useState<[number, number]>([
    40.87649434150835, -124.07918370203882,
  ]);

  const [overlayIndex, setOverlayIndex] = useState<number>(-1);
  const [attractionsOverlayIndex, setAttractionsOverlayIndex] = useState<number>(-1);

  const [showThisWeeksEvents, setShowThisWeeksEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<GetHumspotEventResponse[]>([]);


  const [showTopAttractions, setShowTopAttractions] = useState<boolean>(false);
  const [attractions, setAttractions] = useState<any[]>([]);

  const [showEventsBetweenTwoDates, setShowEventsBetweenTwoDates] = useState<boolean>(false);
  const [eventsBetweenTwoDates, setEventsBetweenTwoDates] = useState<GetEventsBetweenTwoDatesStatusResponse['events']>([]);


  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  const fetchTopAttr = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'Highlight');
    setAttractions(res.activities);
  }, []);
  useEffect(() => {
    fetchTopAttr();
  }, [fetchTopAttr]);


  const fetchThisWeeksEvents = useCallback(async () => {
    const res = await handleGetThisWeeksEvents();
    setEvents(res.events);
  }, []);
  useEffect(() => {
    fetchThisWeeksEvents();
  }, [fetchThisWeeksEvents]);

  useIonViewWillEnter(() => {
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  return (
    <IonPage ref={pageRef}>
      <IonContent fullscreen>
        <PigeonMap
          provider={(x, y, z, dpr) =>
            mapTiler(context.darkMode, x, y, z, dpr)
          }
          minZoom={10}
          zoomSnap={false}
          zoom={mapZoom}
          attributionPrefix={false}
          center={center}
          onBoundsChanged={({ center, zoom }) => {
            setCenter(center);
            setZoom(zoom);
          }}
          onClick={(e) => {
            console.log(e.latLng);
            setOverlayIndex(-1);
          }}
        >
          <ZoomControl
            style={{ left: "85%", top: "47.5%", opacity: "95%", zIndex: "100" }}
            buttonStyle={
              !context.darkMode
                ? zoomControlButtonsStyle
                : zoomControlButtonsStyleDark
            }
          />

          {showTopAttractions && attractions && attractions.map((marker, index: number) => {
            if (!marker.latitude || !marker.longitude) return;
            return (
              <Marker
                color={"var(--ion-color-secondary)"}
                style={{ opacity: "85%" }}
                key={marker.name + index.toString()}
                anchor={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                width={40}
                offset={[0, -5]}
                onClick={() => {
                  if (!marker.latitude || !marker.longitude) return;
                  const lat: number = parseFloat(marker.latitude)
                  const long: number = parseFloat(marker.longitude);
                  if (mapZoom > 17) {
                    setCenter([
                      lat - 0.0001,
                      long
                    ]);
                  } else {
                    setCenter([
                      lat - 0.00225,
                      long,
                    ]);
                  }
                  setAttractionsOverlayIndex(index);
                }}
              />
            );
          })}
          {showTopAttractions && attractionsOverlayIndex != -1 && attractions[attractionsOverlayIndex] && attractions[attractionsOverlayIndex].latitude && attractions[attractionsOverlayIndex].longitude && (
            <Overlay
              anchor={[
                parseFloat(attractions[attractionsOverlayIndex].latitude!),
                parseFloat(attractions[attractionsOverlayIndex].longitude!),
              ]}
              offset={[125, 19.5]}
            >
              <IonCard
                style={{ width: "55vw", opacity: "97.5%" }}
                mode="ios"
                onClick={() => router.push("/activity/" + attractions[attractionsOverlayIndex].activityID)}
              >
                <IonCardContent>
                  <div style={{ height: "0.5vh" }} />
                  <IonCardTitle style={{ fontSize: "medium" }} mode="ios">
                    {attractions[attractionsOverlayIndex].name}
                  </IonCardTitle>
                  <IonFab horizontal="end" vertical="top">
                    <p style={{ fontWeight: "bold", fontSize: "2.5vw", color: 'var(--ion-color-primary)' }}>
                      {attractions[attractionsOverlayIndex].tags}
                    </p>
                  </IonFab>
                  <div style={{ height: "0.5vh" }} />
                  <p>
                    {attractions[attractionsOverlayIndex].description.substring(0, 120)}
                    {attractions[attractionsOverlayIndex].description.length > 120 &&
                      " ... "
                    }
                  </p>

                  {attractions[attractionsOverlayIndex].photoUrl &&
                    attractions[attractionsOverlayIndex].photoUrl!.length > 0 ? (
                    <>
                      <div style={{ height: "1vh" }} />
                      <img
                        className="ion-img-container"
                        style={{ borderRadius: '10px', width: '100%' }}
                        src={attractions[attractionsOverlayIndex].photoUrl!}
                        alt=""
                        onError={() => {
                          attractions[attractionsOverlayIndex].photoUrl! = '';
                        }}
                      />
                    </>
                  ) : null}
                </IonCardContent>
              </IonCard>
            </Overlay>
          )}

          {showThisWeeksEvents && events && events.map((marker: GetHumspotEventResponse, index: number) => {
            if (!marker.latitude || !marker.longitude) return;
            return (
              <Marker
                color={"var(--ion-color-secondary)"}
                style={{ opacity: "85%" }}
                key={marker.name + index.toString()}
                anchor={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                width={40}
                offset={[0, -5]}
                onClick={() => {
                  if (!marker.latitude || !marker.longitude) return;
                  const lat: number = parseFloat(marker.latitude)
                  const long: number = parseFloat(marker.longitude);
                  if (mapZoom > 17) {
                    setCenter([
                      lat - 0.0001,
                      long
                    ]);
                  } else {
                    setCenter([
                      lat - 0.00225,
                      long,
                    ]);
                  }
                  setOverlayIndex(index);
                }}
              />
            );
          })}
          {showThisWeeksEvents && overlayIndex != -1 && events[overlayIndex] && events[overlayIndex].latitude && events[overlayIndex].longitude && (
            <Overlay
              anchor={[
                parseFloat(events[overlayIndex].latitude!),
                parseFloat(events[overlayIndex].longitude!),
              ]}
              offset={[125, 19.5]}
            >
              <IonCard
                style={{ width: "55vw", opacity: "97.5%" }}
                mode="ios"
                onClick={() => router.push("/activity/" + events[overlayIndex].activityID)}
              >
                <IonCardContent>
                  <div style={{ height: "0.5vh" }} />
                  <IonCardTitle style={{ fontSize: "medium" }} mode="ios">
                    {events[overlayIndex].name}
                  </IonCardTitle>
                  <IonFab horizontal="end" vertical="top">
                    <p style={{ fontWeight: "bold", fontSize: "2.5vw", color: 'var(--ion-color-primary)' }}>
                      {events[overlayIndex].tags}
                    </p>
                  </IonFab>
                  <div style={{ height: "0.5vh" }} />
                  <p>
                    {events[overlayIndex].description.substring(0, 120)}
                    {events[overlayIndex].description.length > 120 &&
                      " ... "
                    }
                  </p>

                  {events[overlayIndex].photoUrl &&
                    events[overlayIndex].photoUrl!.length > 0 ? (
                    <>
                      <div style={{ height: "1vh" }} />
                      <img
                        className="ion-img-container"
                        style={{ borderRadius: '10px', width: '100%' }}
                        src={events[overlayIndex].photoUrl!}
                        alt=""
                        onError={() => {
                          events[overlayIndex].photoUrl! = '';
                        }}
                      />
                    </>
                  ) : null}
                </IonCardContent>
              </IonCard>
            </Overlay>
          )}

          {showEventsBetweenTwoDates && eventsBetweenTwoDates && eventsBetweenTwoDates.map((marker, index: number) => {
            if (!marker.latitude || !marker.longitude) return;
            return (
              <Marker
                color={"var(--ion-color-secondary)"}
                style={{ opacity: "85%" }}
                key={marker.name + index.toString()}
                anchor={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
                width={40}
                offset={[0, -5]}
                onClick={() => {
                  if (!marker.latitude || !marker.longitude) return;
                  const lat: number = parseFloat(marker.latitude)
                  const long: number = parseFloat(marker.longitude);
                  if (mapZoom > 17) {
                    setCenter([
                      lat - 0.0001,
                      long
                    ]);
                  } else {
                    setCenter([
                      lat - 0.00225,
                      long,
                    ]);
                  }
                  setOverlayIndex(index);
                }}
              />
            );
          })}
          {showEventsBetweenTwoDates && overlayIndex != -1 && eventsBetweenTwoDates[overlayIndex] && eventsBetweenTwoDates[overlayIndex].latitude && eventsBetweenTwoDates[overlayIndex].longitude && (
            <Overlay
              anchor={[
                parseFloat(eventsBetweenTwoDates[overlayIndex].latitude?.toString() || ''),
                parseFloat(eventsBetweenTwoDates[overlayIndex].longitude?.toString() || ''),
              ]}
              offset={[125, 19.5]}
            >
              <IonCard
                style={{ width: "55vw", opacity: "97.5%" }}
                mode="ios"
                onClick={() => router.push("/activity/" + eventsBetweenTwoDates[overlayIndex].activityID)}
              >
                <IonCardContent>
                  <div style={{ height: "0.5vh" }} />
                  <IonCardTitle style={{ fontSize: "medium" }} mode="ios">
                    {eventsBetweenTwoDates[overlayIndex].name}
                  </IonCardTitle>
                  <IonFab horizontal="end" vertical="top">
                    <p style={{ fontWeight: "bold", fontSize: "2.5vw", color: 'var(--ion-color-primary)' }}>
                      {eventsBetweenTwoDates[overlayIndex].tags}
                    </p>
                  </IonFab>
                  <div style={{ height: "0.5vh" }} />
                  <p>
                    {eventsBetweenTwoDates[overlayIndex].description.substring(0, 120)}
                    {eventsBetweenTwoDates[overlayIndex].description.length > 120 &&
                      " ... "
                    }
                  </p>

                  {eventsBetweenTwoDates[overlayIndex].photoUrls &&
                    eventsBetweenTwoDates[overlayIndex].photoUrls.length > 0 ? (
                    <>
                      <div style={{ height: "1vh" }} />
                      <img
                        className="ion-img-container"
                        style={{ borderRadius: '10px', width: '100%' }}
                        src={eventsBetweenTwoDates[overlayIndex].photoUrls[0]}
                        alt=""
                        onError={() => {
                          eventsBetweenTwoDates[overlayIndex].photoUrls[0] = '';
                        }}
                      />
                    </>
                  ) : null}
                </IonCardContent>
              </IonCard>
            </Overlay>
          )}

          <IonFab horizontal="end" vertical="bottom" style={{ transform: 'translateX(10%) translateY(calc(-69.5px))' }}>
            <IonButton id="map-settings-modal" mode='md' color='light' style={{ border: "1px solid var(--ion-color-warning)", borderRadius: '5px' }}>
              <IonIcon icon={settingsOutline} color='secondary' />
            </IonButton>
          </IonFab>

        </PigeonMap>

        <MapSettingsModal page={pageRef.current}
          showTopAttractions={showTopAttractions} setShowTopAttractions={setShowTopAttractions}
          showThisWeeksEvents={showThisWeeksEvents} setShowThisWeeksEvents={setShowThisWeeksEvents}
          setShowEventsBetweenTwoDates={setShowEventsBetweenTwoDates} setEventsBetweenTwoDates={setEventsBetweenTwoDates}
        />

      </IonContent>
    </IonPage>
  );
}

export default Map;
