import {Box, BoxProps, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import {useIntl} from 'react-intl';
import {CONN_DETAILS_ENDPOINT, PREFIX} from './constants';
import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import {useCallback, useMemo, useState} from 'react';
import {ConnectionDetails} from './types';
import LiveStreamVideoConference from './LiveStreamVideoConference';
import '@livekit/components-styles';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  preJoin: `${PREFIX}-prejoin`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  backgroundColor: '#000',
  [`& .${classes.preJoin}`]: {
    display: 'grid',
    placeItems: 'center',
    height: '100%'
  },
  '& .lk-form-control': {
    display: 'none'
  },
  '& .lk-join-button': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}));

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
 |description|.SCLiveStreamForm-description|Styles applied to the description element.|
 |content|.SCLiveStreamForm-content|Styles applied to the content.|
 |prejoin|.SCLiveStreamForm-prejoin|Styles applied to the prejoin.|
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
  const scUserContext: SCUserContextType = useSCUser();

  // INTL
  const intl = useIntl();

  // STATE
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);
  const preJoinDefaults = useMemo(() => {
    return {
      username: scUserContext.user?.username || '',
      videoEnabled: true,
      audioEnabled: true
    };
  }, [scUserContext.user]);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);

  // HANDLERS
  /**
   * Handle PreJoin Submit
   */
  const handlePreJoinSubmit = useCallback(async (values: LocalUserChoices) => {
    if (liveStream) {
      setPreJoinChoices(values);
      const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
      url.searchParams.append('roomName', liveStream.roomName);
      url.searchParams.append('participantName', scUserContext.user?.username);
      /* if (liveStream.region) {
				url.searchParams.append('region', liveStream.region);
			} */
      const connectionDetailsResp = await fetch(url.toString());
      const connectionDetailsData = await connectionDetailsResp.json();
      setConnectionDetails(connectionDetailsData);
    }
  }, []);

  /**
   * Handle PreJoin Error
   */
  const handlePreJoinError = useCallback((e: any) => console.error(e), []);

  /**
   * User must be authenticated
   */
  if (!scUserContext.user) {
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
          <LiveStreamVideoConference
            connectionDetails={connectionDetails}
            userChoices={preJoinChoices}
            options={{codec: props.codec, hq: props.hq}}
          />
        )}
      </Box>
    </Root>
  );
}
