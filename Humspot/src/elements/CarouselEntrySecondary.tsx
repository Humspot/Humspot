import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonPage } from "@ionic/react";

import "./CarouselEntry.css";

function CarouselEntrySecondary({ title, imgsrc }:any) {
    const containerStyle = {
        height: '10vh', // Set the desired height for the container
        overflow: 'hidden', // Hide any overflow outside the container
      };
    
      const imgStyle = {
        width: '100%', // Ensure the image takes up the full width of the container
        height: '100%', // Ensure the image takes up the full height of the container
        objectFit: 'cover', // Crop and fit the image within the container
      };

    return(
        <IonCard>
      <div style={containerStyle}>
        <img
          alt="Attraction Image"
          src={imgsrc}
          className="MainCarouselEntryHeaderImage"
          style={imgStyle as any} // Apply the custom styles to the image
        />
      </div>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
        </IonCard>
    )
}

export default CarouselEntrySecondary;