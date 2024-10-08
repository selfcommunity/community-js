import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType} from '@selfcommunity/types';

/**
 * Get event status
 * @returns status or null
 * @param event
 * @param going
 */
export function getEventStatus(event: SCEventType, going: boolean): SCEventSubscriptionStatusType | null {
  const {subscription_status: status, privacy} = event;

  if (!status) {
    return privacy === SCEventPrivacyType.PRIVATE ? SCEventSubscriptionStatusType.REQUESTED : SCEventSubscriptionStatusType.SUBSCRIBED;
  }

  switch (status) {
    case SCEventSubscriptionStatusType.INVITED:
    case SCEventSubscriptionStatusType.GOING:
    case SCEventSubscriptionStatusType.NOT_GOING:
      return SCEventSubscriptionStatusType.SUBSCRIBED;

    case SCEventSubscriptionStatusType.SUBSCRIBED:
      return going ? SCEventSubscriptionStatusType.GOING : SCEventSubscriptionStatusType.NOT_GOING;

    case SCEventSubscriptionStatusType.REQUESTED:
      return privacy === SCEventPrivacyType.PRIVATE ? null : SCEventSubscriptionStatusType.SUBSCRIBED;

    default:
      return null;
  }
}
