import {SCLiveStreamViewType} from '@selfcommunity/types';

export const PREFIX = 'SCLiveStreamForm';

export const LIVESTREAM_DEFAULT_SETTINGS = {
  muteParticipant: true,
  hideParticipantList: false,
  automaticallyNotifyFollowers: false,
  disableVideo: true,
  disableChat: false,
  disableShareScreen: true,
  view: SCLiveStreamViewType.SPEAKER
};
