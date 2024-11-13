import {SCUserType} from './user';

export interface SCLiveStreamType {
  id?: number;
  title: string;
  description?: string;
  last_started_at?: Date | string;
  last_finished_at?: Date | string;
  closed_at_by_host?: Date | string;
  slug?: string;
  roomName?: string;
  settings?: Record<string, any>;
  host?: SCUserType;
  cover?: string;
}

export enum SCLiveStreamViewType {
  GALLERY = 'gallery',
  SPEAKER = 'speaker'
}

export interface SCLiveStreamConnectionDetailsType {
  serverUrl: string;
  roomName: string;
  participantToken: string;
}

export enum SCLiveStreamConnectionDetailsErrorType {
  LIVE_STREAM_IS_CLOSED = 'LIVE_STREAM_IS_CLOSED',
  MONTHLY_MINUTE_LIMIT_REACHED = 'MONTHLY_MINUTE_LIMIT_REACHED',
  WAITING_HOST_TO_START_LIVE_STREAM = 'WAITING_HOST_TO_START_LIVE_STREAM',
  PARTICIPANTS_LIMIT_REACHED = 'PARTICIPANTS_LIMIT_REACHED'
}

export interface SCLiveStreamConnectionDetailsResponseErrorType {
  error: {code: SCLiveStreamConnectionDetailsErrorType};
}

export interface SCLiveStreamSettingsType {
  muteParticipants?: boolean;
  disableVideo?: boolean;
  disableChat?: boolean;
  disableShareScreen?: boolean;
  hideParticipantsList?: boolean;
  automaticallyNotifyFollowers?: boolean;
  view?: SCLiveStreamViewType;
}
