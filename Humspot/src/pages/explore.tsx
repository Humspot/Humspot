import { IonContent, IonPage } from "@ionic/react";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import './explore.css';
import '@ionic/react/css/ionic-swiper.css';

function ExplorePage() {
    return(
        <>
        <IonPage>
            <IonContent>
                <div className="MainCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="MainCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="MainCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="MainCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="MainCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                    
                </Swiper>
                </div>
                <div className="SecondaryCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                    
                </Swiper>
                </div>
                <div className="SecondaryCarousel"> 
                <Swiper slidesPerView={1.2}>
                    
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 1</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 2</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 3</div></SwiperSlide>
                    <SwiperSlide><div className="SecondaryCarouselSlide">ATTRACTION 4</div></SwiperSlide>
                </Swiper>
                </div>
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