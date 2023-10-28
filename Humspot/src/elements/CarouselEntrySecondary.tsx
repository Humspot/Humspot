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

// import "./CarouselEntry.css";

function CarouselEntrySecondary({ title, imgsrc, id }: any) {
  const router = useIonRouter();

  const secondarycontainerStyle = {
    height: "13vh", // Set the desired height for the container
    overflow: "hidden", // Hide any overflow outside the container
  };

  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "100%", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
  };

  const labelStyle = {
    padding: "2%",
  };

  return (
    <IonCard
      onClick={() => {
        router.push(`/activity/${id}`);
      }}
    >
      <div style={secondarycontainerStyle}>
        <IonImg
          alt="Attraction Image"
          src={imgsrc}
          className="SecondaryCarouselEntryHeaderImage"
          style={imgStyle as any}
        ></IonImg>
      </div>
      <IonCardHeader style={labelStyle}>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
}

export default CarouselEntrySecondary;
