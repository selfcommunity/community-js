import {SCLiveStreamViewType} from '@selfcommunity/types';

export const PREFIX = 'SCLiveStreamForm';

export const LIVESTREAM_DEFAULT_SETTINGS = {
  muteParticipants: true,
  hideParticipantsList: false,
  automaticallyNotifyFollowers: false,
  disableVideo: true,
  disableChat: false,
  disableShareScreen: true,
  view: SCLiveStreamViewType.SPEAKER
};
