import {Status} from './types';

export async function setStatus(status: Status): Promise<Status | null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(status), 300);
  });
}
