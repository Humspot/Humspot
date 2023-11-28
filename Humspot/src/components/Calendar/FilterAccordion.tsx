import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import {
  baseball,
  basketball,
  basketballOutline,
  book,
  bookOutline,
  caretDownCircle,
  filter,
  footsteps,
  musicalNote,
  musicalNoteOutline,
  school,
  schoolOutline,
} from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "./FilterAccordion.css";
import "swiper/css";
import { useState } from "react";
const FilterButton = (props: {
  label: any;
  filledIcon: any;
  outlineIcon: any;
  filterprop: any;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { label, filledIcon, outlineIcon, filterprop, setFilter } = props;
  return (
    <IonButton
      fill="clear"
      color="light"
      onClick={() => {
        setFilter((prevFilter) => (prevFilter === label ? null : label));
      }}
    >
      <div className="FilterEntry">
        <IonIcon
          icon={filterprop === label ? filledIcon : outlineIcon}
          color={filterprop === label ? "secondary" : ""}
          size="large"
        ></IonIcon>
        <IonLabel color={filterprop === label ? "secondary" : ""}>{label}</IonLabel>
      </div>
    </IonButton>
  );
};

const FilterAccordion = (props: {
  filterprop: any;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { filterprop, setFilter } = props;
  return (
    <IonAccordionGroup  style={{ position: 'sticky', top: 0, zIndex: 100, }}>
      <IonAccordion
        value="first"
        toggleIcon={caretDownCircle}
        toggleIconSlot="start"
      >
        <IonItem slot="header" color="dark">
          <IonLabel>Filters</IonLabel>
        </IonItem>
        <div slot="content">
          <Swiper slidesPerView={4}>
            <SwiperSlide key="1">
              <FilterButton
                label="School"
                filledIcon={school}
                outlineIcon={schoolOutline}
                filterprop={filterprop}
                setFilter={setFilter}
              />
            </SwiperSlide>
            <SwiperSlide key="2">
              <FilterButton
                label="Library"
                filledIcon={book}
                outlineIcon={bookOutline}
                filterprop={filterprop}
                setFilter={setFilter}
              />
            </SwiperSlide>
            <SwiperSlide key="3">
              <FilterButton
                label="Sports"
                filledIcon={basketball}
                outlineIcon={basketballOutline}
                filterprop={filterprop}
                setFilter={setFilter}
              />
            </SwiperSlide>
            <SwiperSlide key="4">
              <FilterButton
                label="Music"
                filledIcon={musicalNote}
                outlineIcon={musicalNoteOutline}
                filterprop={filterprop}
                setFilter={setFilter}
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  );
};

export default FilterAccordion;
