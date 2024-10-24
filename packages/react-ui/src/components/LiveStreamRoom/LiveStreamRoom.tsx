import {Box, BoxProps, Button, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCPreferencesContextType, SCUserContextType, useSCContext, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import React, {useCallback, useMemo, useState} from 'react';
import {ConnectionDetails} from './types';
import LiveStreamVideoConference from './LiveStreamVideoConference';
import '@livekit/components-styles';
import {generateRoomId} from '../../utils/liveStream';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  preJoin: `${PREFIX}-prejoin`,
  conference: `${PREFIX}-prejoin`,
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
   * Endpoint livestream access
   */
  connectionDetailsEndpoint?: string;

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
 |root|.SCLiveStreamRoom-root|Styles applied to the root element.|
 |title|.SCLiveStreamRoom-title|Styles applied to the title element.|
 |description|.SCLiveStreamRoom-description|Styles applied to the description element.|
 |content|.SCLiveStreamRoom-content|Styles applied to the content.|
 |prejoin|.SCLiveStreamRoom-prejoin|Styles applied to the prejoin.|
 |conference|.SCLiveStreamRoom-conference|Styles applied to the conference.|
 |error|.SCLiveStreamRoom-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function LiveStreamRoom(inProps: LiveStreamRoomProps): JSX.Element {
  //PROPS
  const props: LiveStreamRoomProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, liveStream = null, connectionDetailsEndpoint, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // INTL
  const intl = useIntl();

  // STATE
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const preJoinDefaults = useMemo(() => {
    return {
      username: scUserContext.user?.username || '',
      videoEnabled: true,
      audioEnabled: true
    };
  }, [scUserContext.user]);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);

  const liveStreamEnabled = true;
  /* const liveStreamEnabled = useMemo(
		() =>
			preferences &&
			features &&
			features.includes(SCFeatureName.LIVE_STREAM) &&
			SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
			preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
		[preferences, features]
	); */
  const canCreateLiveStream = useMemo(() => true /* scUserContext?.user?.permission?.create_livestream */, [scUserContext?.user?.permission]);

  // HANDLERS
  /**
   * Handle PreJoin Submit
   */
  const handlePreJoinSubmit = useCallback(
    async (values: LocalUserChoices) => {
      // eslint-disable-next-line no-constant-condition
      if ((liveStream || true) && connectionDetailsEndpoint) {
        setLoading(true);
        setPreJoinChoices(values);
        const url = new URL(connectionDetailsEndpoint, window.location.origin);
        url.searchParams.append('roomName', generateRoomId());
        url.searchParams.append('participantName', scUserContext.user?.username);
        // if (liveStream.region) {
        //	url.searchParams.append('region', liveStream.region);
        // }
        const connectionDetailsResp = await fetch(url.toString());
        const connectionDetailsData = await connectionDetailsResp.json();
        setConnectionDetails(connectionDetailsData);
        setLoading(false);
      }
    },
    [scUserContext.user, connectionDetailsEndpoint, setPreJoinChoices, setConnectionDetails]
  );

  /**
   * Handle PreJoin Error
   */
  const handlePreJoinError = useCallback((e: any) => console.error(e), []);

  /**
   * User must be authenticated
   */
  if (!scUserContext.user || !liveStreamEnabled || !canCreateLiveStream) {
    return <CircularProgress />;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.content} data-lk-theme="default">
        <Box className={classes.title}>{liveStream?.title}</Box>
        <Box className={classes.description}>{liveStream?.description}</Box>
        {connectionDetails === undefined || preJoinChoices === undefined ? (
          <Box className={classes.preJoin}>
            <PreJoin persistUserChoices defaults={preJoinDefaults} onSubmit={handlePreJoinSubmit} onError={handlePreJoinError} />
          </Box>
        ) : (
          <Box className={classes.conference}>
            <LiveStreamVideoConference
              connectionDetails={connectionDetails}
              userChoices={preJoinChoices}
              options={{codec: props.codec, hq: props.hq}}
            />
          </Box>
        )}
      </Box>
    </Root>
  );
}
