/**
 * @file ActivityTagsList.tsx
 * @fileoverview the list of tags related to the activity.
 */

import { IonChip, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

type ActivityTagsListProps = {
  tags: string;
}

const ActivityTagsList = (props: ActivityTagsListProps) => {

  const tags: string = props.tags || '';

  const router = useIonRouter();

  return (
    <FadeIn>
      <section style={{ paddingLeft: '5px' }}>
        {tags &&
          tags.split(',').map((tag: string, index: number) => {
            return (
              <IonChip key={tag + index} color={'secondary'} onClick={() => {
                let encodedTag = encodeURIComponent(tag.trim());
                encodedTag = encodeURIComponent(encodedTag);
                console.log(encodedTag);
                router.push(`/more-results/${encodedTag}`);
              }}>
                {tag}
              </IonChip>
            );
          })}
      </section>
    </FadeIn>
  )

};

export default ActivityTagsList;