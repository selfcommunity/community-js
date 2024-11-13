import * as React from 'react';
import type {MessageDecoder, MessageEncoder, TrackReferenceOrPlaceholder, WidgetState} from '@livekit/components-core';
import {isEqualTrackRef, isTrackReference, isWeb, log} from '@livekit/components-core';
import {RoomEvent, Track} from 'livekit-client';

import {
  CarouselLayout,
  Chat,
  ConnectionStateToast,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  MessageFormatter,
  RoomAudioRenderer,
  useCreateLayoutContext,
  useParticipants,
  usePinnedTracks,
  useTracks
} from '@livekit/components-react';
import {SCUserType} from '@selfcommunity/types';
import {ParticipantTile} from './ParticipantTile';
import {ControlBar} from './ControlBar';


export interface VideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
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
export function VideoConference({
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
  ...props
}: VideoConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: showSettings || false
  });
  const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const tracks = useTracks(
    [
      {source: Track.Source.Camera, withPlaceholder: true},
      {source: Track.Source.ScreenShare, withPlaceholder: false}
    ],
    {updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false}
  );

  const participants = useParticipants();

  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  const handleFocusStateChange = (state) => {
    log.debug('updating widget state', state);
    if (state && state.participant) {
      const updatedFocusTrack = tracks.find((tr) => tr.participant.identity === state.participant.identity);
      if (updatedFocusTrack) {
        layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
      }
    }
  };

  const layoutContext = useCreateLayoutContext();
  const screenShareTracks = tracks.filter(isTrackReference).filter((track) => track.publication.source === Track.Source.ScreenShare);
  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  React.useEffect(() => {
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
    if (focusTrack && !isTrackReference(focusTrack)) {
      const updatedFocusTrack = tracks.find((tr) => tr.participant.identity === focusTrack.participant.identity && tr.source === focusTrack.source);
      if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
        layoutContext.pin.dispatch?.({msg: 'set_pin', trackReference: updatedFocusTrack});
      }
    } else if (speakerFocused) {
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
      }
    }
  }, [
    screenShareTracks.map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`).join(),
    focusTrack?.publication?.trackSid,
    tracks,
    participants,
    speakerFocused
  ]);

  return (
    <div className="lk-video-conference" {...props}>
      {isWeb() && (
        <LayoutContextProvider value={layoutContext} onPinChange={handleFocusStateChange} onWidgetChange={widgetUpdate}>
          <div className="lk-video-conference-inner">
            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper">
                <GridLayout tracks={tracks}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <ParticipantTile />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper">
                <FocusLayoutContainer>
                  {!hideParticipantsList && (
                    <CarouselLayout tracks={carouselTracks}>
                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                      {/* @ts-ignore */}
                      <ParticipantTile />
                    </CarouselLayout>
                  )}
                  {focusTrack && <FocusLayout trackRef={focusTrack} />}
                </FocusLayoutContainer>
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
                settings: !!SettingsComponent
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
          {SettingsComponent && (
            <div className="lk-settings-menu-modal" style={{display: widgetState.showSettings ? 'block' : 'none'}}>
              <SettingsComponent />
            </div>
          )}
        </LayoutContextProvider>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
