import {useEffect, useState} from 'react';
import {Waypoint} from 'react-waypoint';
import ReactPlayer from 'react-player';
import {styled} from '@mui/material';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {DEFAULT_VIDEO_PLAY_TRACKING_DELAY_SECONDS} from '../../constants/Media';

const PREFIX = 'SCAutoPlayer';

const Root = styled(Waypoint, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface AutoPlayerProps {
  /**
   * Handles player loop
   * @default false
   */
  loop?: boolean;
  /**
   * Handles player mute
   * @default true
   */
  muted?: boolean;
  /**
   * Applies the playsinline attribute where supported
   * @default true
   */
  playsinline?: boolean;
  /**
   * Handles player controls
   * @default true
   */
  controls?: boolean;
  /**
   * Handles player stop on component mount
   * @default true
   */
  stopOnUnmount?: boolean;
  /**
   * Handles player pip
   * @default true
   */
  pip?: boolean;
  /**
   * Callback fired when video is played for more than 10 secs
   */
  onVideoWatch?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function AutoPlayer(props: AutoPlayerProps) {
  // PROPS
  const {loop = false, muted = true, playsinline = true, controls = true, stopOnUnmount = true, pip = true, onVideoWatch, ...rest} = props;

  // STATE
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [played, setPlayed] = useState(0);
  const [startPlay, setStartPlay] = useState(0);

  const {preferences}: SCPreferencesContextType = useSCPreferences();

  const enableAutoplay =
    SCPreferences.CONFIGURATIONS_VIDEO_AUTOPLAY_ENABLED in preferences && preferences[SCPreferences.CONFIGURATIONS_VIDEO_AUTOPLAY_ENABLED].value;

  const videoPlayTrackingDelaySeconds =
    SCPreferences.CONFIGURATIONS_VIDEO_PLAY_TRACKING_DELAY_SECONDS in preferences
      ? preferences[SCPreferences.CONFIGURATIONS_VIDEO_PLAY_TRACKING_DELAY_SECONDS].value
      : DEFAULT_VIDEO_PLAY_TRACKING_DELAY_SECONDS;

  useEffect(() => {
    if (played >= startPlay + videoPlayTrackingDelaySeconds && played <= startPlay + videoPlayTrackingDelaySeconds + 1) {
      onVideoWatch?.();
    }
  }, [played, startPlay]);

  /**
   * Handle viewport enter
   */
  function handleEnterViewport() {
    if (enableAutoplay) {
      setShouldPlay(true);
    }
  }

  /**
   * Handles viewport exit
   */
  function handleExitViewport() {
    setShouldPlay(false);
  }

  /**
   * Renders root object
   */
  return (
    <Root scrollableAncestor={window} onEnter={handleEnterViewport} onLeave={handleExitViewport}>
      <div>
        <ReactPlayer
          loop={loop}
          controls={controls}
          stopOnUnmount={stopOnUnmount}
          pip={pip}
          playing={shouldPlay}
          muted={muted}
          onProgress={(progress) => {
            const playedSeconds = progress.playedSeconds;
            if (played === 0) {
              setStartPlay(playedSeconds);
            }
            setPlayed(playedSeconds);
          }}
          playsinline={playsinline}
          config={{
            youtube: {
              embedOptions: {
                host: 'https://www.youtube-nocookie.com'
              },
              playerVars: {rel: 0}
            }
          }}
          {...rest}
        />
      </div>
    </Root>
  );
}
