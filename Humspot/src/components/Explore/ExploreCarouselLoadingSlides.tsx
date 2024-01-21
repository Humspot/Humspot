/**
 * @file ExploreCarouselLoadingSlides.tsx
 * @fileoverview Loading component for the Explore page. 
 */

import { IonCard, IonSkeletonText, IonCardTitle } from "@ionic/react";
import { SwiperSlide, Swiper } from "swiper/react";


export const ExploreCarouselLoadingSlides = (props: { amount: number }) => (
  <>
    <Swiper
      slidesPerView={1.25}
      spaceBetween={20}
      style={{ width: '100%', height: 'auto' }}
    >
      {Array.from({ length: props.amount }, (_: unknown, index: number) => (
        <SwiperSlide key={index} style={{ width: 'auto', height: '100%' }}>
          <IonCard
            style={{
              '--background': 'var(--ion-background-color)',
              height: '100%',
              width: "100%"
            }}
          >
            <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px' }}>
              <IonSkeletonText animated style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7.5px' }} />
            </div>
            <IonCardTitle style={{ textAlign: 'left', paddingTop: "5px", fontSize: "1.35rem", width: "85%" }}>
              <IonSkeletonText animated style={{ height: "1.35rem", width: "85%", borderRadius: "7.5px" }} />
            </IonCardTitle>
            <p style={{
              marginTop: '2.5px',
              marginBottom: '2.5px',
              paddingTop: "5px",
              width: "95%"
            }}>
              <IonSkeletonText animated style={{ height: "0.9rem", borderRadius: "7.5px", width: "95%" }} />
              <IonSkeletonText animated style={{ height: "0.9rem", borderRadius: "7.5px", width: "95%" }} />
            </p>
          </IonCard>
        </SwiperSlide>
      ))}
    </Swiper>
  </>
);
