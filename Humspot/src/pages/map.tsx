import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import FilterButton from "../elements/FilterButton";
export function MyMap() {
  return (
    <Map
      defaultCenter={[40.87649434150835, -124.07918370203882]}
      defaultZoom={15}
      minZoom={10}
      zoomSnap={false}
    >
      <ZoomControl />
      <Marker
        width={50}
        height={50}
        anchor={[40.87649434150835, -124.07918370203882]}
      />
    </Map>
  );
}

function MapPage() {
  return (
    <>
      <IonPage>
        <FilterButton></FilterButton>
        <IonContent>
          <MyMap />
        </IonContent>
      </IonPage>
    </>
  );
}

export default MapPage;
