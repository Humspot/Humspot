/**
 * @file ActivityTagsList.tsx
 * @fileoverview the list of tags related to the activity.
 */

import { IonCard, IonCardHeader, IonCardTitle, IonChip, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

type ActivityTagsListProps = {
  tags: string;
};

const ActivityTagsList = (props: ActivityTagsListProps) => {

  const tags: string = props.tags || '';

  const router = useIonRouter();

  return (
    <FadeIn>
      <IonCard className='activity-card'>
        <IonCardHeader className='ion-no-padding ion-no-margin' style={{ paddingBottom: "10px", paddingTop: '20px', paddingLeft: '20px' }}>
          <IonCardTitle style={{ fontSize: "1.25rem" }}>Tags</IonCardTitle>
        </IonCardHeader>
        <section style={{ paddingLeft: '10px' }}>
          {tags &&
            tags.split(',').map((tag: string, index: number) => {
              return (
                <IonChip key={tag + index} color={'secondary'} onClick={() => {
                  let encodedTag = encodeURIComponent(tag.trim());
                  encodedTag = encodeURIComponent(encodedTag);
                  router.push(`/more-results/${encodedTag}`);
                }}>
                  {tag}
                </IonChip>
              );
            })}
        </section>

      </IonCard>
    </FadeIn>
  )

};

export default ActivityTagsList;