import { SCEventType } from '@selfcommunity/types';

export function checkEventFinished(event: SCEventType | null) {
  if (event && !event.running) {
    return new Date().getTime() > new Date(event.end_date || event.start_date).getTime();
  }

  return false;
}
