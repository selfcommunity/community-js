export const PREFIX = 'SCLiveStreamRoom';
export const defaultVideoOptions = {
  hq: true,
  codec: 'vp9'
} as const;

/**
 * Checking live status on VideoLiveConference
 * In minutes
 */
export const LIVE_CHECKING_INTERVAL = 1;

/**
 * Warning threshold expiring soon
 * In minutes
 */
export const WARNING_THRESHOLD_EXPIRING_SOON = 5;
