/**
 * @file ActivityHeader.tsx
 * @fileoverview Contains the activity images in a Swiper.
 */

import { IonSkeletonText, IonCard } from "@ionic/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { chevronBackOutline } from "ionicons/icons";

import placeholder from "../../assets/images/placeholder.jpeg"

import "swiper/css/autoplay";
import './Activity.css';
import IonPhotoViewer from "@codesyntax/ionic-react-photo-viewer";
import { useState } from "react";

type ActivityHeaderProps = {
  photoUrls: string;
  activityType: string;
  activityLoading: boolean;
};

const ActivityHeader = (props: ActivityHeaderProps) => {

  const photoUrls: string = props.photoUrls || '';
  const activityType: string = props.activityType || 'Activity';
  const activityTypeUpper = activityType[0].toUpperCase() + activityType.slice(1);
  const activityLoading: boolean = props.activityLoading || false;

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const handleImageClick = () => {
    if (swiperInstance) {
      swiperInstance.autoplay.stop();
    }
  };

  return (
    <section className='activity-image-swiper-container'>
      <Swiper modules={[Autoplay, Navigation]} navigation autoplay={{ delay: 2500 }} onSwiper={setSwiperInstance}>
        {activityLoading ?
          <SwiperSlide>
            <IonSkeletonText style={{ height: "200px" }} animated />
          </SwiperSlide>
          :
          photoUrls ?
            photoUrls?.split(",").map((url: any, index: number) => (
              <SwiperSlide key={index}>
                <IonCard className='ion-no-padding ion-no-margin' style={{ width: "97.5vw", marginRight: "5px", marginLeft: "5px" }}>
                  <IonPhotoViewer
                    title={`${activityTypeUpper} Image`}
                    icon={chevronBackOutline}
                    src={url}
                  >
                    <img
                      onClick={() => { console.log("CLICKED ON IMAGE " + index); handleImageClick(); }}
                      alt="Attraction Image"
                      src={url || ''}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </IonPhotoViewer>
                </IonCard>
              </SwiperSlide>
            ))
            :
            <SwiperSlide>
              <IonCard className='ion-no-padding ion-no-margin' style={{ width: "97.5vw" }}>
                <img
                  alt="Attraction Image"
                  src={placeholder}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </IonCard>
            </SwiperSlide>
        }
      </Swiper>
    </section>
  )

};

export default ActivityHeader;