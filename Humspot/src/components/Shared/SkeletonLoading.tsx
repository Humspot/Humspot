import { IonSkeletonText } from "@ionic/react";

type SkeletonLoadingProps = {
  count: number;
  height: string;
  animated: boolean;
};

const SkeletonLoading = (props: SkeletonLoadingProps) => {
  return (
    <>
      {
        Array.from({ length: props.count }, (_, index) => (
          <IonSkeletonText key={index} style={{ height: props.height, borderRadius: '5px' }} animated={props.animated} />
        ))
      }
    </>
  );

};

export default SkeletonLoading;