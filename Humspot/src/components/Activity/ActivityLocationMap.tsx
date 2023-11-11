import { Map, Marker } from "pigeon-maps";
import { memo, useState } from "react";


export const ActivityLocationMap = memo((props: any) => {
  console.log(props);

  const [mapZoom, setZoom] = useState<number>(15);
  const [center, setCenter] = useState<[number, number]>([parseFloat(props.latitude), parseFloat(props.longitude)]);

  if (!props.latitude || !props.longitude) {
    return null;
  }

  return (
    <Map
      maxZoom={14}
      height={120}
      width={120}
      attribution={false}
      zoom={mapZoom}
      center={center}
      onBoundsChanged={({ center, zoom }) => {
        setCenter(center);
        setZoom(zoom);
      }}
    >
      <Marker
        width={30}
        height={30}
        anchor={[parseFloat(props.latitude), parseFloat(props.longitude)]}
        onClick={() => {
          setCenter([
            parseFloat(props.latitude),
            parseFloat(props.longitude),
          ]);
        }}
      />
    </Map>
  );
});

// if (Capacitor.getPlatform() === 'ios') {
//   // Attempt to open Google Maps app on iOS
//   window.open(`comgooglemaps://?q=${lat},${lng}(${encodedLabel})`, '_system');
// } else if (Capacitor.getPlatform() === 'android') {
//   // Attempt to open Google Maps app on Android
//   window.open(`geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`, '_system');
// } else {
//   // Fallback for web
//   window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
// }