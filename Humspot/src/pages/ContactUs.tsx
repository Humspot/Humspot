import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useContext } from "../utils/hooks/useContext";

const ContactUs = () => {

  const context = useContext();

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, [])

  return (
    <IonPage className='ion-page-ios-notch'>

      <GoBackHeader title="Contact Us" />

      <IonContent>
        <section style={{ padding: "10px" }}>
          <p >Email us at <a href="mailto:dev@humspotapp.com">dev@humspotapp.com</a>!</p>
          <p>Visit my <a href="https://www.linkedin.com/in/david-yaranon-59652a248/">LinkedIn</a> as well!</p>
        </section>
      </IonContent >
    </IonPage >
  )
};

export default ContactUs;