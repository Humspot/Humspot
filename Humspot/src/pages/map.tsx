import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonPage, IonText } from "@ionic/react";
import { Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
import { useContext } from "../utils/my-context";
import { mapTiler, zoomControlButtonsStyle, zoomControlButtonsStyleDark } from "../utils/map-config";
import { useCallback, useEffect, useState } from "react";
import { handleGetThisWeeksEvents } from "../utils/server";
import { GetHumspotEventResponse } from "../utils/types";

function MapPage() {

  const context = useContext();

  const [mapZoom, setZoom] = useState<number>(15);
  const [center, setCenter] = useState<[number, number]>([40.87649434150835, -124.07918370203882]);
  const [overlayIndex, setOverlayIndex] = useState<number>(-1);
  const [thisWeeksEvents, setThisWeeksEvents] = useState<GetHumspotEventResponse[]>([]);

  const fetchThisWeeksEvents = useCallback(async () => {
    const res = await handleGetThisWeeksEvents();
    setThisWeeksEvents(res.events);
  }, [])


  useEffect(() => {
    fetchThisWeeksEvents();
  }, [fetchThisWeeksEvents])

  return (
    <IonPage>

      {/* <FilterButton></FilterButton> */}

      <IonContent fullscreen>

        <Map
          provider={(x, y, z, dpr) => mapTiler(false /* context.darkMode */, x, y, z, dpr)}
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
            console.log(e.latLng)
            setOverlayIndex(-1);
          }}
        >
          <ZoomControl style={{ left: "85%", top: "50%", opacity: "95%", zIndex: '100' }} buttonStyle={!context.darkMode ? zoomControlButtonsStyle : zoomControlButtonsStyleDark} />

          {/* Render the map markers */}
          {thisWeeksEvents && thisWeeksEvents.map((marker: GetHumspotEventResponse, index: number) => {
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
            )
          })}

          {/* If map marker is clicked, show card overlay */}
          {overlayIndex != -1 && thisWeeksEvents[overlayIndex] && thisWeeksEvents[overlayIndex].latitude && thisWeeksEvents[overlayIndex].longitude ? (
            <Overlay
              anchor={[
                parseFloat(thisWeeksEvents[overlayIndex].latitude!),
                parseFloat(thisWeeksEvents[overlayIndex].longitude!),
              ]}
              offset={[125, 19.5]}
            >
              <IonCard
                style={!context.darkMode ? { width: "55vw", opacity: "90%" } : { width: "55vw", opacity: "95%" }}
                mode="ios"
              >
                <IonCardContent>
                  <div style={{ height: "0.5vh" }} />
                  <IonCardTitle style={{ fontSize: "medium" }} mode="ios">
                    {thisWeeksEvents[overlayIndex].name}
                  </IonCardTitle>
                  <IonFab horizontal="end" vertical="top">
                    <p style={{ fontWeight: "bold", fontSize: "2.5vw", color: 'var(--ion-color-primary)' }}>
                      {thisWeeksEvents[overlayIndex].tags}
                    </p>
                  </IonFab>
                  <div style={{ height: "0.5vh" }} />
                  <p>
                    {thisWeeksEvents[overlayIndex].description.substring(0, 120)}
                    {thisWeeksEvents[overlayIndex].description.length > 120 &&
                      " ... "
                    }
                  </p>

                  {thisWeeksEvents[overlayIndex].photoUrl &&
                    thisWeeksEvents[overlayIndex].photoUrl!.length > 0 ? (
                    <>
                      <div style={{ height: "1vh" }} />
                      <img
                        className="ion-img-container"
                        style={{ borderRadius: '10px', width: '100%' }}
                        src={thisWeeksEvents[overlayIndex].photoUrl!}
                        alt=""
                        onError={() => {
                          thisWeeksEvents[overlayIndex].photoUrl! = '';
                        }}
                      />
                    </>
                  ) : null}
                </IonCardContent>
              </IonCard>
            </Overlay>
          ) : null}


        </Map>

      </IonContent>
    </IonPage>
  );
}

export default MapPage;
