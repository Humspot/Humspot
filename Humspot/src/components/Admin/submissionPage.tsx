import { 
    IonPage } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useContext } from "../../utils/my-context"; 
import { useCallback, useEffect, useState } from "react";
import { handleGetPendingActivitySubmissions } from "../../utils/server";

const activityPage: React.FC = () => {
    const router = useIonRouter();
    const context = useContext();

    const [activityDetails, setActivityDetails] = useState<any>(null;);

    const fetchSubmissions = useCallback(async () => {
        if (!context.humspotUser) return;
        const response = await handleGetPendingActivitySubmissions(
          1,
          context.humspotUser.userID
        );
        setSubmissions(response.pendingSubmissions);
      }, [context.humspotUser]);
      const [submissions, setSubmissions] = useState<any[]>([]);
}