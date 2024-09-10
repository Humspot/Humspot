/**
 * @file Search.tsx
 * @fileoverview Search results page for when users run a query using the searchbar on the Explore page.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IonButton, IonButtons, IonCard, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon,
  IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonPage, IonSearchbar,
  IonSkeletonText, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { chevronBackOutline, shareSocialOutline } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';

import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

import { handleGetSearchResults } from '../utils/server';
import { timeout } from '../utils/functions/timeout';
import { useContext } from '../utils/hooks/useContext';

import placeholder from '../assets/images/school_placeholder.jpeg';
import { handleShare } from '../utils/functions/handleShare';
import useIonBackButton from '../utils/hooks/useIonBackButton';


type SearchParams = {
  query: string;
};

const tags: string[] = [
  'Camping',
  'Chill',
  'Cultural',
  'Fishing',
  'Food',
  'Highlight',
  'Hiking',
  'Historic',
  'Kayaking',
  'Museum',
  'Networking',
  'Photography',
  'Scenic',
  'School',
  'Shopping',
  'Sightseeing',
  'Wildlife',
  'Beach',
  'Hiking',
  'Camping',
  'Fishing',
  'Sightseeing',
  'Swimming',
  'Kayaking',
  'Canoeing',
  'Boating',
  'Biking',
  'Hunting',
  'Wildlife',
  'Birding',
  'Photography',
  'Scenic',
  'Historic',
  'Museum',
  'Cultural',
  'Shopping',
  'Winery',
  'Brewery',
  'Distillery',
  'Golf',
  'Skiing',
  'Snowboarding',
  'Snowmobiling',
  'Snowshoeing',
  'Cross Country Skiing',
  'Fun',
  'Adventure',
  'Relax',
  'Chill',
  'Music',
  'Festival',
  'Food',
  'School',
  'Educational',
  'Cultural',
  'Art',
  'Dance',
  'Nature',
  'Outdoor',
  'Indoor',
  'Fitness',
  'Yoga',
  'Meditation',
  'Technology',
  'Science',
  'Networking',
  'Business',
  'Entrepreneurship',
  'Community',
  'Charity',
  'Volunteering',
  'Health',
  'Wellness',
  'Cooking',
  'Baking',
  'Crafts',
  'DIY',
  'Workshop',
  'Lecture',
  'Seminar',
  'Conference',
  'TradeShow',
  'Exhibition',
  'Theatre',
  'Cinema',
  'Movies',
  'Comedy',
  'Drama',
  'Romance',
  'SciFi',
  'Fantasy',
  'Horror',
  'Thriller',
  'Mystery',
  'Family',
  'Kids',
  'Teens',
  'Adults',
  'Seniors',
  'Pets',
  'Animals',
  'Gardening',
  'Environment',
  'Sustainability',
  'Politics',
  'History',
  'Literature',
  'Poetry',
  'Writing',
  'Journalism',
  'Photography',
  'Film',
  'Animation',
  'VideoGames',
  'Esports',
  'BoardGames',
  'CardGames',
  'RolePlaying',
  'Fashion',
  'Beauty',
  'Makeup',
  'Skincare',
  'Haircare',
  'Shopping',
  'Auction',
  'Sale',
  'Fundraising',
  'Donations',
  'Spirituality',
  'Religion',
  'Philosophy',
  'Astrology',
  'Travel',
  'Tourism',
  'Sports',
  'Snow',
  'Automotive',
  'Cycling',
  'Running',
  'Abbey of the Redwoods',
  'Adel\'s Restaurant',
  'Adventure',
  'Arcata Community Center',
  'Arcata Playhouse',
  'Arcata Plaza',
  'Arcata Theatre Lounge',
  'Arkley Center for the Performing Arts',
  'Azalea Hall',
  'Bayshore Mall',
  'Beach',
  'Bear River Casino Resort',
  'Benbow Historic Inn',
  'Blue Lake Roller Rink',
  'Brewery',
  'Broadway Cinema',
  'Cal Poly Humboldt',
  'California State Polytechnic University, Humboldt',
  'Central Station Sports Bar',
  'Chill',
  'City of Eureka',
  'Clarke Historical Museum',
  'College of the Redwoods',
  'Crystalline Collective',
  'Del Norte County Fairgrounds',
  'Dick Taylor Craft Chocolate',
  'Dow\'s Prairie Grange',
  'Dutch Bros Coffee',
  'Entrepreneurship',
  'Environmental Protection Information Center',
  'Eureka Center for Spiritual Living',
  'Eureka Chamber of Commerce',
  'Eureka Community Services/Adorni Center',
  'Eureka Main Library',
  'Eureka the Pentecostal Church',
  'Ferndale Music Company & The Old Steeple',
  'Ferndale Repertory Theatre',
  'First Baptist Church of Fortuna',
  'Fortuna Library',
  'Fortuna Monday Club',
  'Garberville Farmers\' Market',
  'Gene Lucas Community Center',
  'Gyppo Ale Mill',
  'Halvorsen Park',
  'Harbor Lanes',
  'HealthSPORT Gymnastics',
  'Healy Senior Center',
  'Herb & Market Humboldt',
  'Highlight',
  'Historic Eagle House',
  'HSU',
  'Humboldt Bay Aquatic Center',
  'Humboldt Bay Social Club',
  'Humboldt Brews LLC',
  'Humboldt County Board of Supervisors',
  'Humboldt County Library',
  'Humboldt County Office of Education',
  'Inn at 2nd & C',
  'Jacoby\'s Storehouse',
  'Labor Temple',
  'Las Michoacana\'s',
  'Lavender Rose Paint Nights',
  'Mad River Brewing Co',
  'Mad River Grange',
  'Mateel Community Center',
  'Mattole Valley Resource Center',
  'McKay Community Forest',
  'McKinleyville Glass',
  'Minor Theatre',
  'Morris Graves Museum of Art',
  'New Heart Community Church',
  'North Coast Aikido',
  'North Coast Growers\' Association Farmers Market',
  'North Coast Repertory Theatre',
  'Northern Realms Trading Cards',
  'Official Crescent City - Del Norte County Visitor ',
  'Pacific Union School',
  'Prairie Creek Redwoods State Park',
  'Redway Elementary School',
  'Redwood Acres Raceway',
  'Redwood Curtain Brewing Company - Eureka, Myrtleto',
  'Redwood Discovery Museum',
  'Redwood Gun Club',
  'Redwood Raks World Dance Collective',
  'Redwood Retro',
  'Redwood Sky Walk at Sequoia Park Zoo',
  'Richards\' Goat Tavern & Tea Room',
  'River Lodge Conference Center',
  'Samoa Power Pole Beach',
  'Sapphire Palace Event Center',
  'Savage Henry Comedy Club',
  'School',
  'Seawood Cape Preserve',
  'Septentrio Winery',
  'Sequoia Park',
  'Shelter Cove Chapel By the Sea',
  'Six Rivers Brewery',
  'Southern Humboldt Chamber of Commerce & Visitors',
  'Stone Junction',
  'The Arcata Plaza',
  'The Arcata Veterans Memorial Building',
  'The Basement',
  'The Bigfoot Museum',
  'The Epitome Gallery',
  'The Eureka Theater',
  'The Game Zone',
  'The Jam',
  'The Lutheran Church of Arcata',
  'the Sanctuary',
  'Theater Arts Building/Van Duzer Theatr',
  'Thomas Carr Park - Firefighters Pavilion',
  'Timber Heritage Association',
  'TrinidadHealingArts',
  'United Indian Health Services - Potawot Health Vil',
  'United Methodist Church-Joyful',
  'Wave Lounge',
  'Wharfinger Building and Eureka Public Marina',
];

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
};

const Search = () => {

  const params = useParams<SearchParams>();
  const query: string = params.query ?? '';

  const router = useIonRouter();
  useIonBackButton(50, () => { router.goBack(); }, [router]);
  const context = useContext();
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const searchRef = useRef<HTMLIonSearchbarElement | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [pageNum, setPageNum] = useState<number>(2);

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

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, [])


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton style={{ fontSize: '1.15em', marginRight: '15px' }} onClick={() => { router.push('/explore', 'back', 'pop'); }}>
              <IonIcon color='primary' icon={chevronBackOutline} />
            </IonButton>
            {query &&
              <p style={{ fontSize: '1.25rem' }}>{query[0].toUpperCase() + query.slice(1)}</p>
            }
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton style={{ padding: 0, margin: 0, fontSize: '1.15rem' }} onClick={async () => await handleShare('Check out these activities on Humspot!')}>
              <IonIcon color='primary' icon={shareSocialOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            ref={searchRef}
            onClick={() => contentRef && contentRef.current && contentRef.current.scrollToTop(1000)}
            placeholder='Search for Activities' spellcheck={true}
            type='search' enterkeyhint='search'
            autocorrect='off' showCancelButton='never' animated={true}
            onKeyDown={e => isEnterPressed(e.key)}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen>
        {query.length > 2 &&
          <>
            <div style={{ paddingLeft: '10px', paddingTop: '7.5px', paddingBottom: '0px', marginBottom: '0px' }}>
              {tags.map((tag: string, idx: number) => {
                if (tag.toLowerCase().includes(query.toLowerCase())) {
                  return (
                    <IonChip
                      key={tag + idx}
                      onClick={() => router.push('/more-results/' + encodeURIComponent(tag))}
                      color='secondary'
                    >
                      <IonLabel>{tag}</IonLabel>
                    </IonChip>
                  )
                }
              })}
            </div>
          </>
        }
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
                {activities.map((activity: { activityType: string; description: string; photoUrl: string | null; name: string; activityID: string }, idx: number) => {
                  return (
                    <FadeIn key={idx} delay={(idx % 20) * 50}>
                      <IonCard style={{ '--background': 'var(--ion-background-color)', paddingLeft: '5px', paddingRight: '5px' }} onClick={() => { router.push('/activity/' + activity.activityID) }}>
                        <div style={{ height: '175px', overflow: 'hidden', borderRadius: '5px' }}>
                          <img
                            src={activity.photoUrl ? activity.photoUrl : (placeholder)}
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
                  <IonTitle className='ion-text-center' style={{ display: 'flex', height: '100%', background: 'var(--ion-background-color)' }}><IonText color='dark'>No Results</IonText></IonTitle>
                </div>
                :
                <></>
        }
      </IonContent>

    </IonPage>
  )


};

export default Search;