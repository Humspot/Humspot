import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonPage, IonText } from "@ionic/react";
import { Map, Marker, Overlay, ZoomControl } from "pigeon-maps";
import FilterButton from "../elements/FilterButton";
import { useContext } from "../utils/my-context";
import { MapMarker, mapTiler, zoomControlButtonsStyle, zoomControlButtonsStyleDark } from "../utils/map-config";
import { useEffect, useState } from "react";

const placeholderAttractions: MapMarker[] = [
  {
    location: [40.87395509634375, -124.07998604637758],
    title: 'Marketplace',
    imgSrc: ['https://activityphotos.s3.us-west-1.amazonaws.com/attraction-photos/P1013997.jpg'],
    description: ['This is a placeholder for the College Creek Marketplace'],
    color: 'var(--ion-color-primary)',
    tags: ['Dining', 'Shop']
  }
];

const getIonColor = (color: string) => {
  let c: string = "";
  for (let i = color.length - 2; i >= 0; --i) {
    if (color[i] === '-') {
      return c.split('').reverse().join('');
    }
    c += color[i];
  }
  return c.split('').reverse().join('');
};

function MapPage() {

  const context = useContext();

  const [mapZoom, setZoom] = useState<number>(15);
  const [center, setCenter] = useState<[number, number]>([40.87649434150835, -124.07918370203882]);
  const [overlayIndex, setOverlayIndex] = useState<number>(-1);


  useEffect(() => {

  }, [])

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
          {placeholderAttractions.map((marker: MapMarker, index: number) => {
            return (
              <Marker
                color={marker.color}
                style={{ opacity: "85%" }}
                key={marker.title + index.toString()}
                anchor={[marker.location[0], marker.location[1]]}
                width={37.5}
                offset={[0, -5]}
                onClick={() => {
                  if (mapZoom > 17) {
                    setCenter([
                      marker.location[0] - 0.0001,
                      marker.location[1],
                    ]);
                  } else {
                    setCenter([
                      marker.location[0] - 0.00225,
                      marker.location[1],
                    ]);
                  }
                  setOverlayIndex(index);
                }}
              />
            )
          })}

          {/* If map marker is clicked, show card overlay */}
          {overlayIndex != -1 && placeholderAttractions[overlayIndex] ? (
            <Overlay
              anchor={[
                placeholderAttractions[overlayIndex].location[0],
                placeholderAttractions[overlayIndex].location[1],
              ]}
              offset={[110, 25]}
            >
              <IonCard
                style={!context.darkMode ? { width: "55vw", opacity: "90%" } : { width: "55vw", opacity: "95%" }}
                mode="ios"
              >
                <IonCardContent>
                  <div style={{ height: "0.5vh" }} />
                  <IonCardTitle style={{ fontSize: "medium" }} mode="ios">
                    {placeholderAttractions[overlayIndex].title}
                  </IonCardTitle>
                  <IonFab horizontal="end" vertical="top">
                    <p style={{ fontWeight: "bold", fontSize: "2.5vw", color: placeholderAttractions[overlayIndex].color }}>
                      {placeholderAttractions[overlayIndex].tags.join(', ')}
                    </p>
                  </IonFab>
                  <div style={{ height: "0.5vh" }} />
                  {placeholderAttractions[overlayIndex].description[0] &&
                    <p>
                      {placeholderAttractions[overlayIndex].description[0].substring(0, 110) + " ... "} <IonText color={getIonColor(placeholderAttractions[overlayIndex].color)}>(more)</IonText>
                    </p>
                  }
                  {placeholderAttractions[overlayIndex].imgSrc &&
                    placeholderAttractions[overlayIndex].imgSrc.length > 0 ? (
                    <>
                      <div style={{ height: "1vh" }} />
                      <img
                        className="ion-img-container"
                        style={{ borderRadius: '10px', width: '100%' }}
                        src={placeholderAttractions[overlayIndex].imgSrc[0]}
                        alt=""
                        onError={() => {
                          placeholderAttractions[overlayIndex].imgSrc = [];
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
