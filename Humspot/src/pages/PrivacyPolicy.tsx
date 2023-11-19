import React from "react";
import { IonPage, IonContent, IonText } from "@ionic/react";

import GoBackHeader from "../components/Shared/GoBackHeader";

const PrivacyPolicy: React.FC = () => {
  return (
    <IonPage>
      <GoBackHeader title="Privacy Policy" />
      <IonContent className="ion-padding">
        <IonText>
          <h2>Welcome to Humspot</h2>
          <p>
            Welcome to Humspot! Your privacy is of utmost importance to us.
            This Privacy Policy explains how we collect, use, share, and protect
            your personal information when you use our services. By creating an
            account or using our services, you agree to the collection and use
            of information in accordance with this policy.
          </p>

          <ol>
            <li>
              <strong>Information Collection and Use</strong>
            </li>
            <p>
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you.{" "}
            </p>
            <p>
              Personally identifiable information may include, but is not
              limited to: name, age, date of birth
            </p>
            <li>
              <strong>Information that we collect</strong>
            </li>
            <p>
              Google Profile Information: This includes your name, email
              address, and profile picture associated with your Google account.
            </p>
            <li>
              <strong>How We Use Your Information</strong>
            </li>
            <p>
              {" "}
              We use information that is collected in various ways including
            </p>
            <ul>
              <li>To provide, maintain, and improve our services.</li>
              <li>To personalize your user experience.</li>
              <li>
                To communicate with you, including providing customer support
                and updates about our services.
              </li>
              <li>To detect, prevent, and address technical issues.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <li>
              <strong>Sharing your information</strong>
            </li>
            <p>We do not share your information.</p>
            <li>
              <strong>Security of Your Information</strong>
            </li>
            <p>
              We take reasonable measures to protect your personal information
              from unauthorized access, disclosure, alteration, and destruction.
              However, no security system is impenetrable, and we cannot
              guarantee the security of our systems.
            </p>

            <li><strong> Your Rights </strong></li>
            <p>You have the right to access, update, or delete your
              personal information at any time. If you wish to exercise any of
              these rights, please contact us at dy45@humboldt.edu </p>

            <li><strong>Changes to This Privacy Policy </strong></li>
            <p>We may update our Privacy Policy from time to
              time. We will notify you of any changes by posting the new Privacy
              Policy on this page and updating the “Last updated” date. We
              encourage you to review this Privacy Policy periodically for any
              changes. </p>

            <li><strong>Contact Us</strong></li>
            <p>If you have any questions about this Privacy
              Policy, please contact us at dy45@humboldt.edu </p>
          </ol>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
