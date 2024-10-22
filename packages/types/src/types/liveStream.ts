import {SCUserType} from './user';

export interface SCLiveStreamType {
  id: number;
  title: string;
  description: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  closed_at?: Date | string;
  slug?: string;
  roomName?: string;
  settings?: Record<string, any>;
  host: SCUserType;
  cover?: string;
}
