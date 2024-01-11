import { Share } from "@capacitor/share";

/**
 * @description calls the Capacitor Share API to allow users to share the
 * current page as a link with an included message.
 * 
 * @param {string} message the message included in the share
 */
export const handleShare = async (message: string): Promise<void> => {
  await Share.share({
    text: message,
    title: message,
    url: 'https://humspotapp.com' + window.location.pathname
  });
};