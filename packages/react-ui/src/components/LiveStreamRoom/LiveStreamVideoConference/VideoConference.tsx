import * as React from 'react';
import type {MessageDecoder, MessageEncoder, TrackReferenceOrPlaceholder, WidgetState} from '@livekit/components-core';
import {isEqualTrackRef, isTrackReference, isWeb, log} from '@livekit/components-core';
import {LocalVideoTrack, RoomEvent, Track} from 'livekit-client';

import {
  CarouselLayout,
  Chat,
  ConnectionStateToast,
  GridLayout,
  LayoutContextProvider,
  MessageFormatter,
  RoomAudioRenderer,
  useCreateLayoutContext,
  useLocalParticipant,
  useParticipants,
  usePinnedTracks,
  useTracks
} from '@livekit/components-react';
import {SCUserType} from '@selfcommunity/types';
import {ParticipantTile} from './ParticipantTile';
import {ControlBar} from './ControlBar';
import {useEffect, useMemo} from 'react';
import {useLivestreamCheck} from './useLiveStreamCheck';
import {FocusLayout, FocusLayoutContainer, FocusLayoutContainerNoParticipants} from './FocusLayout';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {Box, IconButton, styled, Icon} from '@mui/material';
import {useThemeProps} from '@mui/system';
import NoParticipants from './NoParticipants';
import LiveStreamSettingsMenu from './LiveStreamSettingsMenu';
import {BackgroundBlur} from '@livekit/track-processors';
import {isClientSideRendering} from '@selfcommunity/utils';
import {CHOICE_VIDEO_BLUR_EFFECT} from '../../../constants/LiveStream';
import {useSnackbar} from 'notistack';
import {FormattedMessage} from 'react-intl';
import {useLiveStream} from './LiveStreamProvider';

const PREFIX = 'SCVideoConference';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .lk-chat': {
    height: '100%'
  }
}));

export interface VideoConferenceProps {
  className?: string;
  chatMessageFormatter?: MessageFormatter;
  chatMessageEncoder?: MessageEncoder;
  chatMessageDecoder?: MessageDecoder;
  /** @alpha */
  SettingsComponent?: React.ComponentType;
  speakerFocused?: SCUserType;
  disableChat?: boolean;
  disableMicrophone?: boolean;
  disableCamera?: boolean;
  disableShareScreen?: boolean;
  hideParticipantsList?: boolean;
  showSettings?: boolean;
}

/**
 * The `VideoConference` ready-made component is your drop-in solution for a classic video conferencing application.
 * It provides functionality such as focusing on one participant, grid view with pagination to handle large numbers
 * of participants, basic non-persistent chat, screen sharing, and more.
 *
 */
export function VideoConference(inProps: VideoConferenceProps) {
  // PROPS
  const props: VideoConferenceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className,
    chatMessageFormatter,
    chatMessageDecoder,
    chatMessageEncoder,
    SettingsComponent,
    speakerFocused,
    disableChat = false,
    disableMicrophone = false,
    disableCamera = false,
    disableShareScreen = false,
    hideParticipantsList = false,
    showSettings,
    ...rest
  } = props;

  // STATE
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: showSettings || false
  });
  const [focusInitialized, setFocusInitialized] = React.useState(false);
  const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  // HOOKS
  const scUserContext: SCUserContextType = useSCUser();
  const {liveStream} = useLiveStream();

  const [blurEnabled, setBlurEnabled] = React.useState(
    isClientSideRendering() ? window?.localStorage?.getItem(CHOICE_VIDEO_BLUR_EFFECT) === 'true' : false
  );
  const [processorPending, setProcessorPending] = React.useState(false);

  const tracks = useTracks(
    [
      {source: Track.Source.Camera, withPlaceholder: true},
      {source: Track.Source.ScreenShare, withPlaceholder: false}
    ],
    {updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false}
  );
  const tracksNoParticipants = useMemo(
    () =>
      tracks.filter(
        (t) =>
          t.participant.name === scUserContext.user.username ||
          t.participant.name === liveStream.host.username ||
          (speakerFocused && t.participant.name === speakerFocused.username) ||
          t.source === 'screen_share'
      ),
    [tracks, scUserContext.user, liveStream]
  );

  const handleBlur = React.useCallback(
    (event) => {
      if (event.target) {
        if ('checked' in event.target) {
          setBlurEnabled(event.target?.checked);
        } else {
          setBlurEnabled((enabled) => !enabled);
        }
      } else {
        setBlurEnabled((enabled) => !enabled);
      }
      window?.localStorage?.setItem(CHOICE_VIDEO_BLUR_EFFECT, (!blurEnabled).toString());
    },
    [setBlurEnabled, blurEnabled]
  );

  const participants = useParticipants();
  const layoutContext = useCreateLayoutContext();
  const screenShareTracks = tracks.filter(isTrackReference).filter((track) => track.publication.source === Track.Source.ScreenShare);
  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));
  const {cameraTrack} = useLocalParticipant();
  const {enqueueSnackbar} = useSnackbar();
  useLivestreamCheck();

  /**
   * widgetUpdate
   * @param state
   */
  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  /**
   * handleFocusStateChange
   * @param state
   */
  const handleFocusStateChange = (state) => {
    log.debug('updating widget state', state);
    if (state && state.participant) {
      const updatedFocusTrack = tracks.find((tr) => tr.participant.identity === state.participant.identity);
      if (updatedFocusTrack) {
        layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
      }
    }
  };

  useEffect(() => {
    // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
    if (screenShareTracks.some((track) => track.publication.isSubscribed) && lastAutoFocusedScreenShareTrack.current === null) {
      log.debug('Auto set screen share focus:', {newScreenShareTrack: screenShareTracks[0]});
      layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: screenShareTracks[0]});
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some((track) => track.publication.trackSid === lastAutoFocusedScreenShareTrack.current?.publication?.trackSid)
    ) {
      log.debug('Auto clearing screen share focus.');
      layoutContext.pin.dispatch?.({msg: 'clear_pin'});
      lastAutoFocusedScreenShareTrack.current = null;
    }

    if (focusTrack) {
      let updatedFocusTrack;
      const isFocusTrackParticipantExist = participants.find((pt) => pt.identity === focusTrack.participant.identity);
      if (!isFocusTrackParticipantExist) {
        // Focus track is relative to a participant that has left the room
        updatedFocusTrack = tracks.find((tr) => tr.participant.identity === scUserContext.user.id.toString());
        layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
      } else if (!isTrackReference(focusTrack)) {
        // You are not subscribet to the track
        updatedFocusTrack = tracks.find((tr) => tr.participant.identity === focusTrack.participant.identity && tr.source === focusTrack.source);
        if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
          layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
        }
      }
    }
  }, [
    screenShareTracks.map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`).join(),
    focusTrack?.publication?.trackSid,
    tracks,
    participants,
    speakerFocused
  ]);

  useEffect(() => {
    if (speakerFocused && !focusInitialized) {
      const speaker = participants.find((pt) => {
        return pt.name === speakerFocused.username;
      });
      if (speaker) {
        const updatedFocusTrack = tracks.find((tr) => {
          if (tr) {
            return tr.participant.identity === speaker.identity;
          }
          return false;
        });
        layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
        setFocusInitialized(true);
      }
    }
  }, [tracks, participants, speakerFocused]);

  useEffect(() => {
    const localCamTrack = cameraTrack?.track as LocalVideoTrack | undefined;
    if (localCamTrack) {
      setProcessorPending(true);
      try {
        if (blurEnabled && !localCamTrack.getProcessor()) {
          localCamTrack.setProcessor(BackgroundBlur(20));
        } else if (!blurEnabled) {
          localCamTrack.stopProcessor();
        }
      } catch (e) {
        console.log(e);
        setBlurEnabled(false);
        window?.localStorage?.setItem(CHOICE_VIDEO_BLUR_EFFECT, false.toString());
        enqueueSnackbar(
          <FormattedMessage id="ui.liveStreamRoom.errorApplyVideoEffect" defaultMessage="ui.contributionActionMenu.errorApplyVideoEffect" />,
          {
            variant: 'warning',
            autoHideDuration: 3000
          }
        );
      } finally {
        setProcessorPending(false);
      }
    }
  }, [blurEnabled, cameraTrack]);

  return (
    <Root className={classNames(className, classes.root, 'lk-video-conference')} {...rest}>
      {isWeb() && (
        <LayoutContextProvider value={layoutContext} onPinChange={handleFocusStateChange} onWidgetChange={widgetUpdate}>
          <div className="lk-video-conference-inner">
            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper">
                <GridLayout tracks={hideParticipantsList ? tracksNoParticipants : tracks}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <ParticipantTile />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper">
                {/* hideParticipantsList ? (
                  <FocusLayoutContainerNoParticipants>{focusTrack && <FocusLayout trackRef={focusTrack} />}</FocusLayoutContainerNoParticipants>
                ) : (*/}
                <FocusLayoutContainer>
                  {carouselTracks.length ? (
                    <CarouselLayout tracks={hideParticipantsList ? tracksNoParticipants : carouselTracks}>
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-ignore */}
                      <ParticipantTile />
                    </CarouselLayout>
                  ) : (
                    <NoParticipants />
                  )}
                  {focusTrack && <FocusLayout trackRef={focusTrack} />}
                </FocusLayoutContainer>
                {/*)}*/}
              </div>
            )}
            <ControlBar
              controls={{
                ...{
                  chat: !disableChat,
                  microphone: !disableMicrophone,
                  camera: !disableCamera,
                  screenShare: !disableShareScreen
                },
                settings: true
              }}
            />
          </div>
          {!disableChat && (
            <Chat
              style={{display: widgetState.showChat ? 'grid' : 'none'}}
              messageFormatter={chatMessageFormatter}
              messageEncoder={chatMessageEncoder}
              messageDecoder={chatMessageDecoder}
            />
          )}
          <div className="lk-settings-menu-modal" style={{display: widgetState.showSettings ? 'block' : 'none'}}>
            <IconButton className="lk-settings-menu-modal-icon-close" onClick={() => layoutContext?.widget.dispatch?.({msg: 'toggle_settings'})}>
              <Icon>close</Icon>
            </IconButton>
            {SettingsComponent ? (
              <SettingsComponent />
            ) : (
              <>
                <LiveStreamSettingsMenu
                  onlyContentMenu
                  actionBlurDisabled={!cameraTrack && !disableCamera}
                  blurEnabled={blurEnabled}
                  handleBlur={handleBlur}
                />
              </>
            )}
          </div>
        </LayoutContextProvider>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </Root>
  );
}
