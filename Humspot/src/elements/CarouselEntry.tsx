import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  useIonRouter,
} from "@ionic/react";

import "./CarouselEntry.css";

function CarouselEntry({ title, description, imgsrc, id }: any) {
  const router = useIonRouter();

  const containerStyle = {
    height: "30vh", // Set the desired height for the container
    overflow: "hidden", // Hide any overflow outside the container
  };

  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "100%", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
  };

  const headerStyle = {
    padding: "2%",
  };

  return (
    <IonCard
      onClick={() => {
        router.push("/activity/" + id);
      }}
    >
      <div style={containerStyle}>
        <IonImg
          alt="Attraction Image"
          src={imgsrc}
          className="MainCarouselEntryHeaderImage"
          style={imgStyle as any}
        ></IonImg>
      </div>
      <IonCardHeader style={headerStyle}>
        <IonCardTitle>{title}</IonCardTitle>
        <IonCardSubtitle>{description}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
}

export default CarouselEntry;
