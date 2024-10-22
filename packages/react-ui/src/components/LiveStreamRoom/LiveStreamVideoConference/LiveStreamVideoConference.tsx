import {Box, BoxProps, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types/src/index';
import classNames from 'classnames';
import {useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {formatChatMessageLinks, LiveKitRoom, LocalUserChoices, VideoConference} from '@livekit/components-react';
import {ExternalE2EEKeyProvider, RoomOptions, VideoCodec, VideoPresets, Room, DeviceUnsupportedError, RoomConnectOptions} from 'livekit-client';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {ConnectionDetails} from '../types';
import {decodePassphrase} from '../../../utils/liveStream';
import RecordingIndicator from './RecordingIndicator';
import {defaultUserChoices} from '@livekit/components-core';
import {defaultVideoOptions} from '../constants';
// import {SettingsMenu} from './SettingsMenu';
// import {SHOW_SETTINGS_MENU} from '../constants';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({}));

export interface LiveStreamVideoConferenceProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Livestream Object
   * @default null
   */
  liveStream?: SCLiveStreamType;

  /**
   * User choices
   */
  userChoices: LocalUserChoices;

  /**
   * Connection details, include
   *       serverUrl: serverUrl,
   *       roomName: roomName,
   *       participantToken: participantToken,
   *       participantName: participantName
   */
  connectionDetails: ConnectionDetails;

  /**
   * Override video options
   */
  options: {
    hq: boolean;
    codec: VideoCodec;
  };

  /**
   * onLeave room callback
   */
  handleOnLeaveRoom?: () => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamVideoConference component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamVideoConference} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamVideoConference` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|

 * @param inProps
 */
export default function LiveStreamVideoConference(inProps: LiveStreamVideoConferenceProps): JSX.Element {
  //PROPS
  const props: LiveStreamVideoConferenceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    liveStream = null,
    handleOnLeaveRoom,
    userChoices = defaultUserChoices,
    connectionDetails = {},
    options = defaultVideoOptions,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // Passphrase
  const e2eePassphrase = typeof window !== 'undefined' && decodePassphrase(location.hash.substring(1));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const worker = typeof window !== 'undefined' && e2eePassphrase && new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));
  const e2eeEnabled = !!(e2eePassphrase && worker);
  const keyProvider = new ExternalE2EEKeyProvider();
  const [e2eeSetupComplete, setE2eeSetupComplete] = useState(false);

  // Room options
  const roomOptions = useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = options.codec ? options.codec : defaultVideoOptions.codec;
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: options.hq ? VideoPresets.h2160 : VideoPresets.h720
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: options.hq ? [VideoPresets.h1080, VideoPresets.h720] : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined
      },
      adaptiveStream: {pixelDensity: 'screen'},
      dynacast: true,
      e2ee: e2eeEnabled
        ? {
            keyProvider,
            worker
          }
        : undefined
    };
  }, [userChoices, options.hq, options.codec]);

  // Room name
  const room = useMemo(() => new Room(roomOptions), []);

  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true
    };
  }, []);

  useEffect(() => {
    if (e2eeEnabled) {
      keyProvider
        .setKey(decodePassphrase(e2eePassphrase))
        .then(() => {
          room.setE2EEEnabled(true).catch((e) => {
            if (e instanceof DeviceUnsupportedError) {
              alert(
                `You're trying to join an encrypted meeting, but your browser does not support it. Please update it to the latest version and try again.`
              );
              console.error(e);
            } else {
              throw e;
            }
          });
        })
        .then(() => setE2eeSetupComplete(true));
    } else {
      setE2eeSetupComplete(true);
    }
  }, [e2eeEnabled, room, e2eePassphrase]);

  // HANDLERS
  /**
   * Handle on leave
   */
  const handleOnLeave = useCallback(() => handleOnLeaveRoom?.(), [handleOnLeaveRoom]);

  /**
   * Handle on error
   */
  const handleError = useCallback((error: Error) => {
    console.error(error);
    alert(`Encountered an unexpected error, check the console logs for details: ${error.message}`);
  }, []);

  /**
   * Handle encryption error
   */
  const handleEncryptionError = useCallback((error: Error) => {
    console.error(error);
    alert(`Encountered an unexpected encryption error, check the console logs for details: ${error.message}`);
  }, []);

  /**
   * User must be authenticated
   */
  if (!scUserContext.user || !connectionDetails) {
    return <CircularProgress />;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <LiveKitRoom
        connect={e2eeSetupComplete}
        room={room}
        token={connectionDetails.participantToken}
        serverUrl={connectionDetails.serverUrl}
        connectOptions={connectOptions}
        video={userChoices.videoEnabled}
        audio={userChoices.audioEnabled}
        onDisconnected={handleOnLeave}
        onEncryptionError={handleEncryptionError}
        onError={handleError}>
        <VideoConference chatMessageFormatter={formatChatMessageLinks} /*SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined} */ />
        <RecordingIndicator />
      </LiveKitRoom>
    </Root>
  );
}
