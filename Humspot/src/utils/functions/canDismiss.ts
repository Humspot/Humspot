/**
 * @function canDismiss 
 * @description Disallows IonModals to be closed through gestures (swiping down).
 * 
 * @param data 
 * @param role 
 * @returns {Promise<boolean>} whether the modal should be dismissed or not.
 */
export async function canDismiss(data?: any, role?: string): Promise<boolean> {
  return role !== 'gesture';
};