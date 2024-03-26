/**
 * @file ActivityLocationMap.tsx
 * @fileoverview the map component centered at the location of the activity.
 * Clicking on it will open the location in Google Maps.
 */

import { Capacitor } from "@capacitor/core";
import { Map, Marker } from "pigeon-maps";
import { memo } from "react";
import { mapTiler } from "../../utils/map-config";
import useContext from "../../utils/hooks/useContext";
import './Activity.css';

type ActivityLocationMapProps = {
  latitude: string | null;
  longitude: string | null;
  activityName: string;
};

export const ActivityLocationMap = memo((props: ActivityLocationMapProps) => {

  const context = useContext();

  const mapZoom: number = 14;
  const activityName: string = props.activityName;
  const latitude: string | null = props.latitude;
  const longitude: string | null = props.longitude;

  const handleClickOnMap = () => {
    if (Capacitor.getPlatform() === 'ios') {
      window.open(`comgooglemaps://?q=${latitude},${longitude}(${activityName})`, '_system');
    } else if (Capacitor.getPlatform() === 'android') {
      window.open(`geo:${latitude},${longitude}?q=${latitude},${longitude}(${activityName})`, '_system');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    }
  };

  if (!props.latitude || !props.longitude) {
    return null;
  }

  return (
    <section className='map-container'>
      <Map
        provider={(x, y, z, dpr) => mapTiler(context.darkMode, x, y, z, dpr)}
        maxZoom={16}
        attribution={false}
        zoom={mapZoom}
        center={[parseFloat(latitude ?? ''), parseFloat(longitude ?? '')]}
        touchEvents={false}
        onClick={() => { handleClickOnMap() }}
      >
        <Marker
          color={'var(--ion-color-secondary)'}
          width={40}
          height={40}
          anchor={[parseFloat(latitude ?? ''), parseFloat(longitude ?? '')]}
          onClick={() => { handleClickOnMap() }}
        />
      </Map>
    </section>
  );
});