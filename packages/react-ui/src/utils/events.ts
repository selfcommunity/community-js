import {SCEventType} from '@selfcommunity/types';

export function checkEventFinished(event: SCEventType | null) {
  if (event && !event.running) {
    return new Date().getTime() > new Date(event.end_date || event.start_date).getTime();
  }

  return false;
}

export function formatDateForGC(eventDate: string) {
  const date = new Date(eventDate);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
