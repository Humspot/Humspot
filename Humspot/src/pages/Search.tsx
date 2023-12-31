
import { useCallback, useEffect, useRef, useState } from "react";

import { IonButton, IonButtons, IonCard, IonCardTitle,IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonPage, IonSearchbar, IonSkeletonText, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { useParams } from "react-router-dom";
import { chevronBackOutline, shareOutline } from "ionicons/icons";
import { Share } from "@capacitor/share";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

import placeholder from '../assets/images/school_placeholder.jpeg';
import { handleGetSearchResults } from "../utils/server";
import { formatDate } from "../utils/functions/formatDate";
import { Keyboard } from "@capacitor/keyboard";
import { timeout } from "../utils/functions/timeout";

type SearchParams = {
  query: string;
};

const LoadingCard = () => {
  return (
    <IonCard style={{ '--background': 'var(--ion-background-color)' }} >
      <div style={{ padding: '5px' }}>
        <IonSkeletonText style={{ height: '200px', borderRadius: '5px' }} animated />
        <IonSkeletonText style={{ height: '20px', width: '75vw', borderRadius: '5px' }} animated />
        <IonSkeletonText style={{ height: '20px', width: '50vw', borderRadius: '5px' }} animated />
      </div>
    </IonCard >
  )
}

const Search = () => {

  const params = useParams<SearchParams>();
  const query: string = params.query ?? '';

  const router = useIonRouter();
  const searchRef = useRef<HTMLIonSearchbarElement | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState<number>(2);

  const handleShare = async () => {
    await Share.share({
      text: "Check out these activities on Humspot!",
      title: "Check out these activities on Humspot!",
      url: "https://humspotapp.com" + window.location.pathname
    });
  };

  const isEnterPressed = async (key: string) => {
    if (key === 'Enter' || key === 'search') {
      if (searchRef.current) {
        setLoading(true);
        await Keyboard.hide();
        await timeout(300);
        const newQuery: string = searchRef.current.value as string;
        router.push('/search/' + encodeURIComponent(newQuery), 'none');
      }
    }
  };

  const handleSearch = useCallback(async () => {
    if (query) {
      const res = await handleGetSearchResults(query, 1);
      setActivities(res.results);
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton style={{ fontSize: '1.15em', marginLeft: '-2.5px' }} onClick={() => { router.push('/explore', 'back', 'pop'); }}>
              <IonIcon icon={chevronBackOutline} /> <p>Back</p>
            </IonButton>
            <IonTitle>Search</IonTitle>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleShare}>
              <IonIcon style={{ transform: "scale(1.1)" }} icon={shareOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            ref={searchRef}
            // onClick={() => contentRef && contentRef.current && contentRef.current.scrollToTop(1000)}
            placeholder="Search for Events" spellcheck={true}
            type="search" enterkeyhint="search"
            autocorrect="off" showCancelButton="focus" animated={true}
            onKeyDown={e => isEnterPressed(e.key)}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {
          loading ?
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
            :
            activities && activities.length > 0 ?
              <>
                {activities.map((activity, idx: number) => {
                  return (
                    <FadeIn key={idx} delay={(idx % 20) * 50}>
                      <IonCard style={{ '--background': 'var(--ion-background-color)', paddingLeft: '5px', paddingRight: '5px' }} onClick={() => { if ('activityID' in activity && activity.activityID) router.push('/activity/' + activity.activityID) }}>
                        <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px' }}>
                          <img
                            src={activity.photoUrls ? activity.photoUrls.trim().split(',')[0] : (placeholder)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <IonCardTitle style={{ marginTop: '5px', fontSize: '1.35rem' }}>{activity.name}</IonCardTitle>
                        <p style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2.5px',
                          marginBottom: '2.5px',
                          fontSize: '0.9rem'
                        }}>
                          {activity.description}
                        </p>
                        {'eventDate' in activity &&
                          <p style={{ marginTop: 0, marginBottom: '5px', fontSize: '0.8rem' }}><i>{formatDate(activity.eventDate)}</i></p>
                        }
                      </IonCard>
                    </FadeIn>
                  )
                })}
                <IonInfiniteScroll
                  onIonInfinite={async (ev) => {
                    const response = await handleGetSearchResults(query, pageNum);
                    if (response.success) {
                      setPageNum((prev) => prev + 1);
                      setActivities((prev) => [...(prev as any[]), ...(response.results as any[])]);
                    }
                    ev.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
              </>
              :
              !loading ?
                <div style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                  <IonTitle className='ion-text-center' style={{ display: 'flex', height: '110%', background: 'var(--ion-background-color)' }}><IonText color='dark'>No Results</IonText></IonTitle>
                </div>
                :
                <></>
        }
      </IonContent>

    </IonPage>
  )


};

export default Search;