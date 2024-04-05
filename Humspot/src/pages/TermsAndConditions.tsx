import React from "react";
import { IonPage, IonContent, useIonViewWillEnter } from "@ionic/react";

import GoBackHeader from "../components/Shared/GoBackHeader";
import useContext from "../utils/hooks/useContext";

const TermsAndConditions: React.FC = () => {

  const context = useContext();

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  return (
    <IonPage>
      <GoBackHeader translucent={true} title="Terms and Conditions" />

      <IonContent fullscreen>
        <h2 style={{ paddingLeft: "20px", paddingBottom: 0, marginBottom: 0 }}>Welcome to Humspot</h2>
        <section className="ion-padding">
          <p>
            By downloading or using the app, these terms will
            automatically apply to you – you should make sure therefore
            that you read them carefully before using the app. You’re not
            allowed to copy or modify the app, any part of the app, or
            our trademarks in any way. You’re not allowed to attempt to
            extract the source code of the app, and you also shouldn’t try
            to translate the app into other languages or make derivative
            versions. The app itself, and all the trademarks, copyright,
            database rights, and other intellectual property rights related
            to it, still belong to David Yaranon.
          </p>
          <p><strong>Objectionable Content Policy</strong></p>
          <p>
            At Humspot, we are committed to maintaining a respectful and safe user environment. You agree that you shall not upload, post, transmit, or make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another’s privacy, hateful, or racially, ethnically, or otherwise objectionable. We reserve the right, at our sole discretion, to review, edit, or delete any material posted by users which we deem to be objectionable, in violation of these terms, or against applicable laws or regulations.
          </p>
          <p>
            You acknowledge that Humspot may or may not pre-screen content, but that Humspot and its designees shall have the right (but not the obligation) in their sole discretion to pre-screen, refuse, or remove any content that is available via the app. Without limiting the foregoing, Humspot and its designees shall have the right to remove any content that violates these terms or is otherwise objectionable.
          </p>
          <p>
            By using the app, you agree to bear all risks associated with the use of any content, including any reliance on the accuracy, completeness, or usefulness of such content. You acknowledge, consent, and agree that Humspot may access, preserve, and disclose your account information and content if required to do so by law or in a good faith belief that such access preservation or disclosure is reasonably necessary to: (a) comply with legal process; (b) enforce these terms; (c) respond to claims that any content violates the rights of third parties; (d) respond to your requests for customer service; or (e) protect the rights, property, or personal safety of Humspot, its users, and the public.
          </p>

          <p>
            David Yaranon is committed to ensuring that the app is
            as useful and efficient as possible. For that reason, we
            reserve the right to make changes to the app or to charge for
            its services, at any time and for any reason. We will never
            charge you for the app or its services without making it very
            clear to you exactly what you’re paying for.
          </p>
          <p>
            The Humspot app stores and processes personal data that
            you have provided to us, to provide my
            Service. It’s your responsibility to keep your phone and
            access to the app secure. We therefore recommend that you do
            not jailbreak or root your phone, which is the process of
            removing software restrictions and limitations imposed by the
            official operating system of your device. It could make your
            phone vulnerable to malware/viruses/malicious programs,
            compromise your phone’s security features and it could mean
            that the Humspot app won’t work properly or at all.
          </p>
          <p>
            You should be aware that there are certain things that
            David Yaranon will not take responsibility for. Certain
            functions of the app will require the app to have an active
            internet connection. The connection can be Wi-Fi or provided
            by your mobile network provider, but David Yaranon
            cannot take responsibility for the app not working at full
            functionality if you don’t have access to Wi-Fi, and you don’t
            have any of your data allowance left.
          </p>
          <p></p>
          <p>
            If you’re using the app outside of an area with Wi-Fi, you
            should remember that the terms of the agreement with your
            mobile network provider will still apply. As a result, you may
            be charged by your mobile provider for the cost of data for
            the duration of the connection while accessing the app, or
            other third-party charges. In using the app, you’re accepting
            responsibility for any such charges, including roaming data
            charges if you use the app outside of your home territory
            (i.e. region or country) without turning off data roaming. If
            you are not the bill payer for the device on which you’re
            using the app, please be aware that we assume that you have
            received permission from the bill payer for using the app.
          </p>
          <p>
            Along the same lines, David Yaranon cannot always take
            responsibility for the way you use the app i.e. You need to
            make sure that your device stays charged – if it runs out of
            battery and you can’t turn it on to avail the Service,
            David Yaranon cannot accept responsibility.
          </p>
          <p>
            With respect to David Yaranon’s responsibility for your
            use of the app, when you’re using the app, it’s important to
            bear in mind that although we endeavor to ensure that it is
            updated and correct at all times, we do rely on third parties
            to provide information to us so that we can make it available
            to you. David Yaranon accepts no liability for any
            loss, direct or indirect, you experience as a result of
            relying wholly on this functionality of the app.
          </p>
          <p>
            At some point, we may wish to update the app. The app is
            currently available on iOS – the requirements for the
            system(and for any additional systems we
            decide to extend the availability of the app to) may change,
            and you’ll need to download the updates if you want to keep
            using the app. David Yaranon does not promise that it
            will always update the app so that it is relevant to you
            and/or works with the iOS version that you have
            installed on your device. However, you promise to always
            accept updates to the application when offered to you, We may
            also wish to stop providing the app, and may terminate use of
            it at any time without giving notice of termination to you.
            Unless we tell you otherwise, upon any termination, (a) the
            rights and licenses granted to you in these terms will end;
            (b) you must stop using the app, and (if needed) delete it
            from your device.
          </p>
          <p><strong>Changes to This Terms and Conditions</strong></p> <p>
            I may update our Terms and Conditions
            from time to time. Thus, you are advised to review this page
            periodically for any changes. I will
            notify you of any changes by posting the new Terms and
            Conditions on this page.
          </p>
          <p>
            These terms and conditions are effective as of 2024-01-07
          </p>
          <p><strong>Contact Us</strong></p>
          <p>
            If you have any questions or suggestions about my
            Terms and Conditions, do not hesitate to contact me
            at dev@humspotapp.com.
          </p>
          <p>This Terms and Conditions page was generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" target="_blank" rel="noopener noreferrer">App Privacy Policy Generator</a></p>
        </section >
      </IonContent >
    </IonPage >
  );
};

export default TermsAndConditions;