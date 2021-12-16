import React, {useState} from 'react';
import {Waypoint} from 'react-waypoint';
import ReactPlayer from 'react-player';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCAutoPlayer';

const Root = styled(Waypoint, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export default function AutoPlayer({
  enableAutoplay = true,
  loop = false,
  muted = true,
  controls = true,
  stopOnUnmount = true,
  pip = true,
  ...rest
}: {
  enableAutoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  stopOnUnmount?: boolean;
  pip?: boolean;
  [p: string]: any;
}) {
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  /**
   * handleEnterViewport
   */
  function handleEnterViewport() {
    if (enableAutoplay) {
      setShouldPlay(true);
    }
  }

  /**
   * handleExitViewport
   */
  function handleExitViewport() {
    setShouldPlay(false);
  }

  return (
    <Root>
      <Waypoint scrollableAncestor={window} onEnter={handleEnterViewport} onLeave={handleExitViewport}>
        <div>
          <ReactPlayer
            config={{
              youtube: {
                playerVars: {rel: 0}
              }
            }}
            enableAutoplay={enableAutoplay}
            loop={loop}
            controls={controls}
            stopOnUnmount={stopOnUnmount}
            pip={pip}
            playing={shouldPlay}
            muted={muted}
            {...rest}
          />
        </div>
      </Waypoint>
    </Root>
  );
}
