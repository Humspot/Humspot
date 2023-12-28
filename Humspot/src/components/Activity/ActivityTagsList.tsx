import { IonChip, useIonRouter } from "@ionic/react";

type ActivityTagsListProps = {
  tags: string;
}

const ActivityTagsList = (props: ActivityTagsListProps) => {

  const tags: string = props.tags || '';

  const router = useIonRouter();

  return (
    <section style={{ paddingLeft: '10px' }}>
      {tags &&
        tags.split(',').map((tag: string, index: number) => {
          return (
            <IonChip key={tag + index} color={'secondary'} onClick={() => { router.push(`/more-results/${tag.trim()}`) }}>
              {tag}
            </IonChip>
          );
        })}
    </section>
  )

};

export default ActivityTagsList;