import React, { useEffect } from "react";
import { IonPage, IonContent, IonText, useIonViewWillEnter, useIonRouter } from "@ionic/react";

import GoBackHeader from "../components/Shared/GoBackHeader";
import { useContext } from "../utils/my-context";
import { navigateBack } from "../components/Shared/BackButtonNavigation";

const TermsAndConditions: React.FC = () => {

  const context = useContext();
  const router = useIonRouter()

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, () => {
        navigateBack(router, false);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

  return (
    <IonPage>
      <IonContent>
        <GoBackHeader title="Terms and Conditions" />
        <section className="ion-padding">
          <IonText >
            <h2>Welcome to Humspot</h2>
            <p>
              These terms and conditions outline the rules and regulations for the
              use of HumSpot's Website, located at . By
              accessing this website, we assume you accept these terms and
              conditions. Do not continue to use HumSpot's website if you do not
              agree to take all of the terms and conditions stated on this page.
            </p>
            <p>
              The following terminology applies to these Terms and Conditions,
              Privacy Statement and Disclaimer Notice, and any or all Agreements:
              "Client", "You", and "Your" refers to you, the person accessing this
              website and accepting the Company's terms and conditions. "The
              Company", "Ourselves", "We", "Our", and "Us", refers to our Company.
              "Party", "Parties", or "Us", refers to both the Client and
              ourselves, or either the Client or ourselves. All terms refer to the
              offer, acceptance, and consideration of payment necessary to
              undertake the process of our assistance to the Client in the most
              appropriate manner, whether by formal meetings of a fixed duration,
              or any other means, for the express purpose of meeting the Client's
              needs in respect of the provision of the Company's stated
              services/products, in accordance with and subject to, prevailing law
              of USA. Any use of the above terminology or other words in the
              singular, plural, capitalisation and/or he/she or they, are taken as
              interchangeable and therefore as referring to the same.
            </p>

            <ol>
              <li><strong>Acceptance of Terms </strong></li>
              <p>By accessing or using the Service, you agree
                to be bound by these Terms. If you disagree with any part of the
                terms, you may not access the Service.</p>

              <li><strong>Changes to Terms</strong> </li>
              <p>We reserve the right, at our sole discretion, to
                modify or replace these Terms at any time. If a revision is
                material, we will try to provide at least 30 days' notice prior to
                any new terms taking effect. What constitutes a material change
                will be determined at our sole discretion.</p>


              <li><strong>Communication </strong>
                <p>By creating an account on our Service, you agree to
                  subscribe to newsletters, marketing or promotional materials, and
                  other information we may send. However, you may opt-out of
                  receiving any, or all, of these communications from us by
                  following the unsubscribe link or instructions provided in any
                  email we send.</p>
              </li>

              <li><strong>Content </strong>
                <p>Our Service allows you to post, link, store, share, and
                  otherwise make available certain information, text, graphics,
                  videos, or other material ("Content"). You are responsible for the
                  Content that you post on or through the Service, including its
                  legality, reliability, and appropriateness.</p>
              </li>

              <li><strong>Accounts </strong>
                <p>When you create an account with us, you must provide us
                  with information that is accurate, complete, and current at all
                  times. Failure to do so constitutes a breach of the Terms, which
                  may result in immediate termination of your account on our
                  Service.</p>
              </li>

              <li><strong>Links to Other Websites </strong>

                <p> Our Service may contain links to
                  third-party websites or services that are not owned or controlled
                  by Humspot. Humspot has no control over,
                  and assumes no responsibility for, the content, privacy policies,
                  or practices of any third-party websites or services. You further
                  acknowledge and agree that Humspot shall not be
                  responsible or liable, directly or indirectly, for any damage or
                  loss caused or alleged to be caused by or in connection with the
                  use of or reliance on any such content, goods, or services
                  available on or through any such websites or services.</p>
              </li>

              <li><strong>Governing Law</strong>
                <p>These Terms shall be governed and construed in
                  accordance with the laws of USA, without regard to its
                  conflict of law provisions.</p>
              </li>

              <li><strong>Changes</strong>
                <p>Changes We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will provide at least 30 days' notice prior to any new terms
                  taking effect. What constitutes a material change will be
                  determined at our sole discretion.</p>
              </li>

              <li><strong>Contact</strong>
                <p>Contact Us If you have any questions about these Terms, please
                  contact us at support@humspotapp.com</p>
              </li>
            </ol>
            <h3>Hyperlinking to our Content</h3>
            <ol>
              <li>
                The following organizations may link to our Web site without prior
                written approval:
                <ol>
                  <li>Government agencies;</li>
                  <li>Search engines;</li>
                  <li>News organizations;</li>
                  <li>
                    Online directory distributors when they list us in the
                    directory may link to our Web site in the same manner as they
                    hyperlink to the Web sites of other listed businesses; and
                  </li>
                  <li>
                    Systemwide Accredited Businesses except soliciting non-profit
                    organizations, charity shopping malls, and charity fundraising
                    groups which may not hyperlink to our Web site.
                  </li>
                </ol>
              </li>
            </ol>
          </IonText>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default TermsAndConditions;