import { IonContent, IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useContext } from "../utils/hooks/useContext";
import useIonBackButton from "../utils/hooks/useIonBackButton";

const ContactUs = () => {

  const context = useContext();
  const router = useIonRouter();
  useIonBackButton(50, () => { router.goBack(); }, [router]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, [])

  return (
    <IonPage>

      <GoBackHeader translucent={true} title="Contact Us" />

      <IonContent fullscreen>
        <section style={{ padding: "10px" }}>
          <p >Email us at <a href="mailto:dev@humspotapp.com">dev@humspotapp.com</a>!</p>
          <p>Visit my <a href="https://www.linkedin.com/in/david-yaranon-59652a248/">LinkedIn</a> as well!</p>
        </section>
      </IonContent >
    </IonPage >
  )
};

export default ContactUs;