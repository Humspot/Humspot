
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonIcon, IonPage, useIonRouter, useIonViewDidEnter } from "@ionic/react";
import { Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
import { useContext } from "../utils/my-context";
import { mapTiler, zoomControlButtonsStyle, zoomControlButtonsStyleDark } from "../utils/map-config";
import { useCallback, useEffect, useState } from "react";
import { handleGetActivitiesGivenTag, handleGetEventsBetweenTwoDates, handleGetThisWeeksEvents } from "../utils/server";
import { GetHumspotEventResponse } from "../utils/types";
import { settingsOutline } from "ionicons/icons";
import MapSettingsModal from "../components/Map/MapSettingsModal";
import { navigateBack } from "../components/Shared/BackButtonNavigation";


function MapPage() {
  const context = useContext();
  const router = useIonRouter();

  const [mapZoom, setZoom] = useState<number>(15);
  const [center, setCenter] = useState<[number, number]>([
    40.87649434150835, -124.07918370203882,
  ]);
  const [overlayIndex, setOverlayIndex] = useState<number>(-1);
  const [attrIndex, setAttrIndex] = useState<number>(-1);

  const [showThisWeeksEvents, setShowThisWeeksEvents] = useState<boolean>(true);
  const [events, setEvents] = useState<GetHumspotEventResponse[]>([]);

  const [showTopAttractions, setShowTopAttractions] = useState<boolean>(false);
  const [attractions, setAttractions] = useState<any[]>([]);


  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        navigateBack(router);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

  const fetchTopAttr  = useCallback(async () => {
    const res = await handleGetActivitiesGivenTag(1, 'Highlight');
    setEvents(res.activities);
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

  return (
    <IonPage>
      {/* <FilterButton></FilterButton> */}

      <IonContent>
        <Map
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
            style={{ left: "85%", top: "50%", opacity: "95%", zIndex: "100" }}
            buttonStyle={
              !context.darkMode
                ? zoomControlButtonsStyle
                : zoomControlButtonsStyleDark
            }
          />

          {/* Render the map markers */}
          {showThisWeeksEvents && events && events.map((marker: GetHumspotEventResponse, index: number) => {
            if (!marker.latitude || !marker.longitude) return;
            return (
              <Marker
                color={"var(--ion-color-event-marker)"}
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

          {/* If map marker is clicked, show card overlay */}
          {showThisWeeksEvents && overlayIndex != -1 && events[overlayIndex] && events[overlayIndex].latitude && events[overlayIndex].longitude ? (
            <Overlay
              anchor={[
                parseFloat(events[overlayIndex].latitude!),
                parseFloat(events[overlayIndex].longitude!),
              ]}
              offset={[125, 19.5]}
            >
              <IonCard
                style={
                  !context.darkMode
                    ? { width: "55vw", opacity: "90%" }
                    : { width: "55vw", opacity: "95%" }
                }
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
          ) : null}

          <IonFab horizontal="end" vertical="bottom" style={{ transform: 'translateX(15%) translateY(-15%)' }}>
            <IonButton id="map-settings-modal" mode='ios' style={{ borderRadius: '7.5px' }}>
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonFab>

        </Map>

        <MapSettingsModal showTopAttractions={showTopAttractions} setShowTopAttractions={setShowTopAttractions} showThisWeeksEvents={showThisWeeksEvents} setShowThisWeeksEvents={setShowThisWeeksEvents} />

      </IonContent>
    </IonPage>
  );
}

export default MapPage;
