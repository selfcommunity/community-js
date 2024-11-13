import * as React from 'react';
import {useDisconnectButton} from '@livekit/components-react';

/** @public */
export interface DisconnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  stopTracks?: boolean;
}

/**
 * The `DisconnectButton` is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally this is the big red button that allows end users to leave the video or audio call.
 */
export const DisconnectButton: (props: DisconnectButtonProps & React.RefAttributes<HTMLButtonElement>) => React.ReactNode =
  /* @__PURE__ */ React.forwardRef<HTMLButtonElement, DisconnectButtonProps>(function DisconnectButton(props: DisconnectButtonProps, ref) {
    const {buttonProps} = useDisconnectButton(props);
		console.log(buttonProps);

		return (
      <button ref={ref} {...buttonProps}>
        {props.children}
      </button>
    );
  });
