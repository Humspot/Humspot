import {
  IonAvatar, IonCard, IonCardHeader, IonCardSubtitle,
  IonChip, IonRow, IonSkeletonText
} from "@ionic/react";

import { useContext } from "../../utils/my-context";
import { formatDate } from "../../utils/formatDate";


const AdminBio: React.FC = () => {
  const context = useContext();
  return (
    <>
      <IonCard>
        <IonCardSubtitle style={{ marginLeft: '1%', textAlign: 'left' }}>
            <p style={{ fontSize: "0.75rem" }}>
              {!context.humspotUser ?
                <IonSkeletonText animated style={{ width: "70%" }} />
                :
                <>
                  Member since {formatDate(context.humspotUser.dateCreated)}
                </>
              }
            </p>
        </IonCardSubtitle>

        <IonCardHeader>
          <IonRow style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            {context.humspotUser && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 0.9 }}>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    100
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>Pending Activities</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    50
                  </div>
                  <div style={{ fontSize: '0.95rem' }}>Approved Activities</div>
                </div>
                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    0
                  </div>
                  <div style={{ fontSize: '0.95rem' }}> Approved Organizors</div> 
                </div>

                <div className="user-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                    3
                  </div>
                  <div style={{ fontSize: '0.95rem' }}> Pending Organizors</div> 
                </div>
              </div>
            )}

          </IonRow>

        </IonCardHeader>
      </IonCard>
    </>
  )
};

export default AdminBio;