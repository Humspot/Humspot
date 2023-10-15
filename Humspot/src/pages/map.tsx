/* React imports */
import { useEffect, useState } from "react";

/* Ionic/Capacitor */
import {
  IonContent, IonSelect, IonSelectOption, IonPage,
} from "@ionic/react";
import { App as CapacitorApp } from "@capacitor/app";

/* CSS + Other components */
import "./map.css";
import { MapMarker, zoomControlButtonsStyle, zoomControlButtonsStyleDark } from "./map-config";
import { Map as PigeonMap, Marker, ZoomControl, Overlay } from "pigeon-maps";
import { useContext } from "../my-context";


const selectOptions = {
  header: 'Pin Filters',
  subHeader: 'Select which type of pin to display on the map'
};

const markers: MapMarker[] = [
  { location: [37.250458, -120.350249], title: 'test', imgSrc: [''], description: [''], tag: 'testTag', color: 'var(--ion-color-primary)', }
]

function Map() {
  /* Hooks */
  const context = useContext();

  /* State variables */
  const [center, setCenter] = useState<[number, number]>([37.250458, -120.350249]);
  const [mapZoom, setZoom] = useState(6);
  const [markerFilter, setMarkerFilter] = useState<string>("ALL");

  /**
   * @description closes the app when the hardware back button is pressed (android only).
   */
  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        CapacitorApp.exitApp();
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, []);


  return (
    <IonPage>
      <IonContent fullscreen={true} className="no-scroll-content">
        <div className={"map-overlay"}>
          <IonSelect
            interface="action-sheet"
            interfaceOptions={selectOptions}
            okText="Filter"
            cancelText="Cancel"
            className='map-select'
            style={markerFilter === 'A' ? { marginLeft: "50%" } : markerFilter === "Dining" ? { marginLeft: "37.5%" } : { marginLeft: "35%" }}
            value={markerFilter}
            placeholder="Filter: ALL"
            onIonChange={(e: any) => {
              // setOverlayIndex(-1);
            }}
          >
            <IonSelectOption value="1">1</IonSelectOption>
            <IonSelectOption value="2">2</IonSelectOption>
          </IonSelect>
        </div>

        <PigeonMap
          // provider={(x, y, z, dpr) => mapTiler(context.mapTilerId, x, y, z, dpr)}
          center={center}
          zoom={mapZoom}
          animate={true}
          zoomSnap={false}
          attributionPrefix={false}
          onBoundsChanged={({ center, zoom }) => {
            setCenter(center);
            setZoom(zoom);
          }}
          onClick={(e) => {
            // setOverlayIndex(-1);
          }}
        >
          <ZoomControl style={{ left: "85%", top: "45%", opacity: "95%", zIndex: '100' }} buttonStyle={zoomControlButtonsStyleDark} />

          {markers.map((marker: MapMarker, index: number) => {
            return (
              <Marker
                color={marker.color}
                style={{ opacity: "95%" }}
                key={marker.title + index.toString()}
                anchor={[marker.location[0], marker.location[1]]}
                width={35}
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
                  // setOverlayIndex(-1);
                  // setOverlayIndex(index);
                }}
              />
            );
          })
          }
        </PigeonMap>
      </IonContent>
    </IonPage>
  );
}

export default Map;
