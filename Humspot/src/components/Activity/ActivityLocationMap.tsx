import { Map, Marker } from "pigeon-maps";


export function LocationMap(props: any) {
  console.log(props);
  return (
    <Map
      defaultCenter={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      defaultZoom={12}
      minZoom={12}
      maxZoom={12}
      height={120}
      width={120}
      attribution={false}
      mouseEvents={false}
      touchEvents={false}
    >
      <Marker
        width={30}
        height={30}
        anchor={[parseFloat(props.latitude), parseFloat(props.longitude)]} />
    </Map>
  );
}
