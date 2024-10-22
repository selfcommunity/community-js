import {Box, BoxProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import {useIntl} from 'react-intl';
import {CONN_DETAILS_ENDPOINT, PREFIX} from './constants';
import {formatChatMessageLinks, LiveKitRoom, LocalUserChoices, PreJoin, VideoConference} from '@livekit/components-react';
// import {ExternalE2EEKeyProvider, RoomOptions, VideoCodec, VideoPresets, Room, DeviceUnsupportedError, RoomConnectOptions} from 'livekit-client';
import {useCallback, useState} from 'react';
import {ConnectionDetails} from './types';
import LiveStreamVideoConference from './LiveStreamVideoConference';

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

export interface LiveStreamRoomProps extends BoxProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  liveStream?: SCLiveStreamType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS LiveStreamRoom component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {LiveStreamRoom} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `LiveStreamRoom` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStreamForm-root|Styles applied to the root element.|
 |title|.SCLiveStreamForm-title|Styles applied to the title element.|
 |content|.SCLiveStreamForm-content|Styles applied to the element.|
 |actions|.SCLiveStreamForm-actions|Styles applied to the actions.|
 |error|.SCLiveStreamForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function LiveStreamRoom(inProps: LiveStreamRoomProps): JSX.Element {
  //PROPS
  const props: LiveStreamRoomProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, liveStream = null, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(undefined);
  const preJoinDefaults = React.useMemo(() => {
    return {
      username: '',
      videoEnabled: true,
      audioEnabled: true
    };
  }, []);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);

  const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
    url.searchParams.append('roomName', props.roomName);
    url.searchParams.append('participantName', values.username);
    if (props.region) {
      url.searchParams.append('region', props.region);
    }
    const connectionDetailsResp = await fetch(url.toString());
    const connectionDetailsData = await connectionDetailsResp.json();
    setConnectionDetails(connectionDetailsData);
  }, []);
  const handlePreJoinError = useCallback((e: any) => console.error(e), []);

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{display: 'grid', placeItems: 'center', height: '100%'}}>
          <PreJoin defaults={preJoinDefaults} onSubmit={handlePreJoinSubmit} onError={handlePreJoinError} />
        </div>
      ) : (
        <LiveStreamVideoConference connectionDetails={connectionDetails} userChoices={preJoinChoices} options={{codec: props.codec, hq: props.hq}} />
      )}
    </Root>
  );
}
