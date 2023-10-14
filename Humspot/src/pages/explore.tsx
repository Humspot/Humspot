import { IonContent, IonHeader, IonPage } from "@ionic/react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import './explore.css';
import '../elements/CarouselEntry.css';
import '@ionic/react/css/ionic-swiper.css';
import CarouselEntry from "../elements/CarouselEntry";

function ExplorePage() {
    const mainCarouselData = [
        { title: "Attraction 1", description: "This is the first slide", imgsrc:"https://source.unsplash.com/random/?forest"},
        { title: "Attraction 2", description: "This is the second slide", imgsrc:"https://source.unsplash.com/random/?forest,trail" },
        { title: "Attraction 3", description: "This is the third slide", imgsrc:"https://source.unsplash.com/random/?beach" },
        { title: "Attraction 4", description: "This is the fourth slide", imgsrc:"https://source.unsplash.com/random/?beach,trail" },
      ];

    const mainCarouselEntries = mainCarouselData.map((data, index) => (
        <SwiperSlide key={index}>
          <div className="MainCarouselSlide">
            <CarouselEntry title={data.title} description={data.description} imgsrc={data.imgsrc}/>
          </div>
        </SwiperSlide>
      ));

    return(
        <>
        <IonPage>
            <IonContent>
                <IonHeader>
                    Highlights
                  </IonHeader>
                <div className="MainCarousel">
                <Swiper slidesPerView={1.2}>
                    
                {mainCarouselEntries}
                    
                </Swiper>
                </div>
                <IonHeader>
                  Chill Places
                </IonHeader>
                <div className="SecondaryCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                    
                </Swiper>
                </div>
                <IonHeader>
                  Short Notice
                </IonHeader>
                <div className="SecondaryCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                </Swiper>
                </div>
                <IonHeader>
                  Adventure
                </IonHeader>
                <div className="SecondaryCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                </Swiper>
                </div>
            </IonContent>
        </IonPage>
        </>
    )
}

export default ExplorePage;