import {Box, BoxProps, Button, CircularProgress, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  Link,
  SCContextType,
  SCPreferencesContextType,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types/src/index';
import classNames from 'classnames';
import {PREFIX} from './constants';
import {
  Chat,
  ConnectionState,
  formatChatMessageLinks,
  GridLayout,
  LayoutContextProvider,
  LiveKitRoom,
  LiveKitRoomProps,
  LocalUserChoices,
  ParticipantTile,
  VideoConferenceProps
  // VideoConference
} from '@livekit/components-react';
import {ExternalE2EEKeyProvider, RoomOptions, VideoCodec, VideoPresets, Room, DeviceUnsupportedError, RoomConnectOptions} from 'livekit-client';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ConnectionDetails} from '../types';
import {decodePassphrase} from '../../../utils/liveStream';
import RecordingIndicator from './RecordingIndicator';
import {defaultUserChoices} from '@livekit/components-core';
import {defaultVideoOptions} from '../constants';
import {FormattedMessage} from 'react-intl';
import EventInviteButton from '../../EventInviteButton';
import {VideoConference} from './VideoConference';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  endConferenceWrap: `${PREFIX}-end-conference-wrap`,
  btnBackHome: `${PREFIX}-btn-back-home`,
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
  userChoices?: LocalUserChoices;

  /**
   * Connection details, include
   *       serverUrl: serverUrl,
   *       roomName: roomName,
   *       participantToken: participantToken,
   *       participantName: participantName
   */
  connectionDetails?: ConnectionDetails;

  /**
   * Override video options
   */
  options?: {
    hq: boolean;
    codec: VideoCodec;
  };

  /**
   * onLeave room callback
   */
  handleOnLeaveRoom?: () => void;

  /**
   * Props to spread to LiveKitRoomComponent
   * @default {}
   */
  LiveKitRoomComponentProps?: LiveKitRoomProps;

  /**
   * Props to spread to VideoConferenceComponent
   * @default {}
   */
  VideoConferenceComponentProps?: VideoConferenceProps;

  /**
   * Element to be inserted before end conference content
   */
  startConferenceEndContent?: React.ReactNode | null;

  /**
   * Element to be inserted after end conference content
   */
  endConferenceEndContent?: React.ReactNode | null;

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
    liveStream,
    handleOnLeaveRoom,
    userChoices = defaultUserChoices,
    connectionDetails = {},
    LiveKitRoomComponentProps = {
      /* simulateParticipants: true */
    },
    VideoConferenceComponentProps = {},
    startConferenceEndContent,
    endConferenceEndContent,
    options = defaultVideoOptions,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // Passphrase
  // const e2eePassphrase = typeof window !== 'undefined' && decodePassphrase(location.hash.substring(1));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const worker = typeof window !== 'undefined' && e2eePassphrase && new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));
  // const e2eeEnabled = !!(e2eePassphrase && worker);
  // const keyProvider = new ExternalE2EEKeyProvider();
  const [e2eeSetupComplete, setE2eeSetupComplete] = useState(true);
  const [liveActive, setLiveActive] = useState(true);
  const [error, setError] = useState(null);

  /* const liveStreamRoomMaxParticipants = useMemo(
		() =>
			preferences &&
			SCPreferences.CONFIGURATIONS_LIVE_STREAM_MAX_PARTICIPANTS in preferences &&
			preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_MAX_PARTICIPANTS].value,
		[preferences]
	); */

  // Room options
  /* const roomOptions = useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = options.codec ? options.codec : defaultVideoOptions.codec;
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    return {
      // emptyTimeout: 3 * 60, // 3 minutes
      // maxParticipants: liveStreamRoomMaxParticipants,
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
  }, [liveStreamRoomMaxParticipants, userChoices, options.hq, options.codec]); */

  // Create room - only initial
  /* const room = useMemo(() => {
    const room = new Room();
    return new Room(roomOptions);
  }, [liveStreamRoomMaxParticipants]); */

  const connectOptions = useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true
    };
  }, []);

  /* useEffect(() => {
    if (room) {
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
          .then(() => {
            setE2eeSetupComplete(true);
            setLiveActive(true);
          });
      } else {
        setE2eeSetupComplete(true);
        setLiveActive(true);
      }
    }
  }, [e2eeEnabled, room, e2eePassphrase]); */

  // HANDLERS
  /**
   * Handle on leave
   */
  const handleOnLeave = useCallback(() => {
    setLiveActive(false);
    handleOnLeaveRoom?.();
  }, [handleOnLeaveRoom]);

  /**
   * Handle on error
   */
  const handleError = useCallback((error: Error) => {
    console.error(error);
    setError(`Encountered an unexpected error, check the console logs for details: ${error.message}`);
    setLiveActive(false);
  }, []);

  /**
   * Handle encryption error
   */
  const handleEncryptionError = useCallback((error: Error) => {
    console.error(error);
    setError(`Encountered an unexpected encryption error, check the console logs for details: ${error.message}`);
    setLiveActive(false);
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
  console.log(liveStream);
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {liveActive && !error ? (
        <>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <LiveKitRoom
            connect={Boolean(e2eeSetupComplete && liveActive)}
            token={connectionDetails['participantToken']}
            serverUrl={connectionDetails['serverUrl']}
            connectOptions={connectOptions}
            video={userChoices.videoEnabled}
            audio={userChoices.audioEnabled}
            onDisconnected={handleOnLeave}
            onEncryptionError={handleEncryptionError}
            onError={handleError}
            {...LiveKitRoomComponentProps}>
            <LayoutContextProvider>
              <VideoConference chatMessageFormatter={formatChatMessageLinks} speakerFocused={liveStream.host} {...VideoConferenceComponentProps} />
              {/* <Chat /> */}
              {/* <RecordingIndicator /> */}
              {/*<EventInviteButton eventId={129} />*/}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <ConnectionState />
            </LayoutContextProvider>
          </LiveKitRoom>
        </>
      ) : (
        <>
          {error ? (
            <Box className={classes.endConferenceWrap}>
              {startConferenceEndContent}
              {error}
              {endConferenceEndContent}
            </Box>
          ) : liveActive === false ? (
            <Box className={classes.endConferenceWrap}>
              {startConferenceEndContent}
              <Typography variant="h5">
                <FormattedMessage id="ui.liveStreamRoom.conference.end" defaultMessage="ui.liveStreamRoom.conference.end" />
              </Typography>
              <Button variant="contained" color="secondary" component={Link} to={'/'} className={classes.btnBackHome}>
                <FormattedMessage id="ui.liveStreamRoom.button.backHome" defaultMessage="ui.liveStreamRoom.button.backHome" />
              </Button>
              {endConferenceEndContent}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </>
      )}
    </Root>
  );
}
