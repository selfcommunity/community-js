import {SCNotificationAggregatedType, SCNotificationType} from '@selfcommunity/types';

/**
 * Compare widget priority
 * @param w1
 * @param w2
 */
export const widgetSort = (w1, w2) => (w1.position > w2.position ? 1 : -1);

/**
 * Get unseen notifications from a collection of item
 * of type SCNotificationAggregatedType
 * @return number
 */
export const getUnseenNotification = (data: SCNotificationAggregatedType[]): SCNotificationType[] => {
  let _unseen: SCNotificationType[] = [];
  if (data && Array.isArray(data)) {
    data.map((n: SCNotificationAggregatedType) => {
      if (n.is_new) {
        n.aggregated.map((a: SCNotificationType) => {
          a.is_new && _unseen.push(a);
        });
      }
    });
  }
  return _unseen;
};

/**
 * Get unseen notification counter from a colletion of item
 * of type SCNotificationAggregatedType
 * @return number
 */
export const getUnseenNotificationCounter = (data: SCNotificationAggregatedType[]): number => {
  return getUnseenNotification(data).length;
};
