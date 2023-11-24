import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonModal, IonNote, IonRow, IonSkeletonText, IonTitle, IonToolbar } from "@ionic/react"
import { Rating } from "react-custom-rating-component"
import { useContext } from "../../utils/my-context";
import { handleAddRating } from "../../utils/server";
import { useToast } from "@agney/ir-toast";
import { useRef, useState } from "react";
import { chevronBackOutline } from "ionicons/icons";

type ActivityHeaderTitleProps = {
  activity: boolean;
  activityType: "event" | "attraction" | "custom" | undefined;
  id: string;
  name: string | undefined;
  avgRating: number | undefined;
}

const ActivityHeaderTitle = (props: ActivityHeaderTitleProps) => {

  const context = useContext();
  const Toast = useToast();

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const [ratingLoading, setRatingLoading] = useState<boolean>(false);

  const changeRating = async (rating: number) => {
    if (!context.humspotUser) return;
    setRatingLoading(true);
    const res = await handleAddRating(context.humspotUser.userID, props.id, rating);
    if (res.success) {
      const t = Toast.create({ message: "Rating added!", duration: 2000, color: 'secondary' });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: 'danger' });
      t.present();
    }
    setRatingLoading(false);
  }

  return (
    <>
      <IonCard color={"primary"} className="headercard">
        <IonCardHeader>
          {props.activity ? (
            <>
              <IonCardTitle>
                {<h1>{props.name}</h1>}
              </IonCardTitle>
              {props.activityType === 'attraction' &&
                <>
                  <br />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      readOnly={true}
                      defaultValue={props.avgRating ?? 0}
                      spacing='5px'
                      activeColor='#F6D075'
                      precision={0.5}
                      onChange={async (newRating) => await changeRating(newRating)}
                    />
                    <p style={{ paddingLeft: "15px", fontSize: "1.15rem", paddingTop: "1px" }}>
                      {props.avgRating ? `(${props.avgRating})` : ''}
                    </p>
                  </div>

                  <div>
                    <IonButton className='ion-no-padding' slot='start' fill="clear" style={{ color: "#3D6876" }} id='add-rating-button'>
                      Add Rating
                    </IonButton>
                  </div>
                </>
              }
            </>
          ) : (
            <IonCardTitle>
              <IonSkeletonText animated></IonSkeletonText>
            </IonCardTitle>
          )}
        </IonCardHeader>
      </IonCard>

      {props.activityType === 'attraction' &&
        <IonModal trigger='add-rating-button' ref={modalRef}>
          <IonContent>
            <IonHeader className='ion-no-border'>
              <IonToolbar style={{ '--background': 'var(--ion-item-background' }}>
                <IonButtons>
                  <IonButton color='secondary' style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { modalRef.current?.dismiss(); }}>
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                  <IonTitle>Rate Attraction</IonTitle>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <section style={ratingLoading ? { opacity: "0.5" } : { opacity: "1" }}>
              <Rating
                readOnly={ratingLoading}
                defaultValue={props.avgRating ?? 0}
                size='30px'
                spacing='10px'
                activeColor='#F6D075'
                precision={0.5}
                onChange={async (newRating) => await changeRating(newRating)}
              />
            </section>
          </IonContent>
        </IonModal>
      }

    </>
  )
};

export default ActivityHeaderTitle;