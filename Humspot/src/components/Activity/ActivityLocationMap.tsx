import { Capacitor } from "@capacitor/core";
import { Map, Marker } from "pigeon-maps";
import { memo } from "react";
import { mapTiler } from "../../utils/map-config";

type ActivityLocationMapProps = {
  latitude: string | null;
  longitude: string | null;
  activityName: string;
};

export const ActivityLocationMap = memo((props: ActivityLocationMapProps) => {

  const mapZoom: number = 13.5;
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
    <Map
      provider={(x, y, z, dpr) => mapTiler(false /* context.darkMode */, x, y, z, dpr)}
      maxZoom={14}
      height={120}
      width={120}
      attribution={false}
      zoom={mapZoom}
      center={[parseFloat(latitude ?? ''), parseFloat(longitude ?? '')]}
      touchEvents={false}
      onClick={() => { handleClickOnMap() }}
    >
      <Marker
        width={30}
        height={30}
        anchor={[parseFloat(latitude ?? ''), parseFloat(longitude ?? '')]}
        onClick={() => { handleClickOnMap() }}
      />
    </Map>
  );
});