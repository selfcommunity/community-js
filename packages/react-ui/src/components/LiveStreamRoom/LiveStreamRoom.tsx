import {Alert, Box, BoxProps, Button, CircularProgress, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchLiveStream,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {
  SCFeatureName,
  SCLiveStreamConnectionDetailsErrorType,
  SCLiveStreamConnectionDetailsResponseErrorType,
  SCLiveStreamConnectionDetailsType,
  SCLiveStreamType
} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {PREFIX} from './constants';
import {LocalUserChoices} from '@livekit/components-react';
import React, {useCallback, useMemo, useState} from 'react';
import {ConnectionDetails} from './types';
import LiveStreamVideoConference, {LiveStreamVideoConferenceProps} from './LiveStreamVideoConference';
import '@livekit/components-styles';
import {LiveStreamService} from '@selfcommunity/api-services';
import {camelCase, Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {PreJoin} from './LiveStreamVideoConference/PreJoin';
import {LiveStreamContext} from './LiveStreamVideoConference/LiveStreamProvider';
import {useSnackbar} from 'notistack';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
  description: `${PREFIX}-description`,
  endConferenceWrap: `${PREFIX}-end-conference-wrap`,
  btnBackHome: `${PREFIX}-btn-back-home`,
  startPrejoinContent: `${PREFIX}-start-prejoin-content`,
  preJoin: `${PREFIX}-prejoin`,
  preJoinLoading: `${PREFIX}-prejoin-loading`,
  prejoinLoader: `${PREFIX}-prejoin-loader`,
  endPrejoinContent: `${PREFIX}-end-prejoin-content`,
  conference: `${PREFIX}-conference`,
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
   * Id of the liveStream for filter the feed
   * @default null
   */
  liveStreamId?: number;
  /**
   * Element to be inserted before title
   */
  startPrejoinContent?: React.ReactNode | null;
  /**
   * Element to be inserted after title
   */
  endPrejoinContent?: React.ReactNode | null;
  /**
   * Show title of livestream in prejoin
   */
  showPrejoinTitle?: boolean;
  /**
   * Show description of livestream in prejoin
   */
  showPrejoinDescription?: boolean;
  /**
   * ConnectionDetails Object
   * @default null
   */
  presetConnectionDetails?: ConnectionDetails;
  /**
   * LocalUserChoices Object
   * @default null
   */
  presetPreJoinChoices?: LocalUserChoices;
  /**
   * Props to spread to LiveStreamVideoConference Component
   * @default {}
   */
  LiveStreamVideoConferenceComponentProps?: LiveStreamVideoConferenceProps;
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
  const {
    id = `live_stream_room_object_${props.liveStreamId ? props.liveStreamId : props.liveStream ? props.liveStream.id : ''}`,
    liveStreamId = null,
    liveStream = null,
    className,
    showPrejoinTitle = true,
    showPrejoinDescription = false,
    startPrejoinContent,
    endPrejoinContent,
    presetConnectionDetails,
    presetPreJoinChoices,
    LiveStreamVideoConferenceComponentProps = {options: {codec: 'vp8', hq: false}},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // STATE
  const {scLiveStream} = useSCFetchLiveStream({id: liveStreamId, liveStream});
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(presetPreJoinChoices);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const preJoinDefaults = useMemo(() => {
    return {
      username: scUserContext.user?.username || '',
      videoEnabled: scLiveStream?.settings?.disableVideo === false,
      audioEnabled: scLiveStream?.settings?.muteParticipants === false
    };
  }, [scUserContext.user, scLiveStream]);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | undefined>(presetConnectionDetails);
  const liveStreamEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.LIVE_STREAM) &&
      SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
    [preferences, features]
  );

  // INTL
  const intl = useIntl();

  // MESSAGES
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  /**
   * Handle PreJoin Submit
   */
  const handlePreJoinSubmit = useCallback(
    (values: LocalUserChoices) => {
      if (scLiveStream || !loading) {
        setLoading(true);
        setError(null);
        toggleAttrDisabledPrejoinActions(true);
        LiveStreamService.join(scLiveStream.id)
          .then((data: SCLiveStreamConnectionDetailsType | SCLiveStreamConnectionDetailsResponseErrorType) => {
            setPreJoinChoices(values);
            setConnectionDetails({...(data as SCLiveStreamConnectionDetailsType), participantName: scUserContext.user.username});
            toggleAttrDisabledPrejoinActions(false);
            setLoading(false);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            if (error.response && error.response.data && typeof error.response.data === 'object' && error.response.data.error) {
              let _msg = intl.formatMessage({
                id: 'ui.liveStreamRoom.connect.error.generic',
                defaultMessage: 'ui.liveStreamRoom.connect.error.generic'
              });
              if (error.response.data.error.code) {
                const _error = `ui.liveStreamRoom.connect.error.${camelCase(error.response.data.error.code)}`;
                _msg = intl.formatMessage({id: _error, defaultMessage: _error});
              }
              setError(_msg);
              enqueueSnackbar(_msg, {variant: 'error', autoHideDuration: 5000});
            }
            setLoading(false);
          });
      }
    },
    [scUserContext.user, setPreJoinChoices, setConnectionDetails, scLiveStream, setError, loading]
  );

  /**
   * Handle disable controls button
   */
  const toggleAttrDisabledPrejoinActions = useCallback((disabled: boolean) => {
    const container = document.querySelector('.lk-prejoin');
    if (container) {
      const buttons = container.querySelectorAll('button.lk-button');
      buttons.forEach((button) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        button.disabled = disabled;
      });
    }
  }, []);

  /**
   * Handle PreJoin Error
   */
  const handlePreJoinError = useCallback((e: any) => console.error(e), []);

  /**
   * User must be authenticated
   */
  if (!scLiveStream || !scUserContext.user || !liveStreamEnabled) {
    return <CircularProgress />;
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      {!scLiveStream.closed_at_by_host ? (
        <Box className={classes.endConferenceWrap}>
          <Typography variant="h5">
            <FormattedMessage id="ui.liveStreamRoom.conference.closed" defaultMessage="ui.liveStreamRoom.conference.closed" />
          </Typography>
          <Button variant="contained" color="secondary" component={Link} to={'/'} className={classes.btnBackHome}>
            <FormattedMessage id="ui.liveStreamRoom.button.backHome" defaultMessage="ui.liveStreamRoom.button.backHome" />
          </Button>
        </Box>
      ) : (
        <Box className={classes.content} data-lk-theme="default">
          {connectionDetails === undefined || preJoinChoices === undefined ? (
            <>
              {startPrejoinContent && <Box className={classes.startPrejoinContent}>{startPrejoinContent}</Box>}
              {scLiveStream?.title && (
                <Typography component={'div'} variant="h5" className={classes.title}>
                  {scLiveStream?.title}
                </Typography>
              )}
              {scLiveStream?.description && (
                <Typography component={'div'} variant="body1" className={classes.description}>
                  {scLiveStream?.description}
                </Typography>
              )}
              <Box className={classNames(classes.preJoin, {[classes.preJoinLoading]: loading || error})}>
                <LiveStreamContext.Provider value={{liveStream: scLiveStream}}>
                  <PreJoin defaults={preJoinDefaults} onSubmit={handlePreJoinSubmit} onError={handlePreJoinError} />
                </LiveStreamContext.Provider>
                {loading && (
                  <Box className={classes.prejoinLoader}>
                    <CircularProgress />
                    <Typography component={'div'} variant="body2">
                      <FormattedMessage id="ui.liveStreamRoom.connecting" defaultMessage="ui.liveStreamRoom.connecting" />
                    </Typography>
                  </Box>
                )}
                {error && (
                  <Box className={classes.prejoinLoader}>
                    <Typography component={'div'} variant="body2">
                      {error}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box className={classes.endPrejoinContent}>
                {Boolean(
                  scUserContext.user &&
                    scUserContext.user.id !== scLiveStream.host.id &&
                    scLiveStream &&
                    (scLiveStream.settings?.muteParticipants || (scLiveStream && scLiveStream.settings?.disableVideo))
                ) && (
                  <Stack sx={{width: '60%'}} spacing={1}>
                    {scLiveStream && scLiveStream.settings?.muteParticipants && (
                      <Alert variant="outlined" severity="info" component={'div'}>
                        <FormattedMessage id="ui.liveStreamRoom.hostDisableMicrophone" defaultMessage="ui.liveStreamRoom.hostDisableMicrophone" />
                      </Alert>
                    )}
                    {scLiveStream && scLiveStream.settings?.disableVideo && (
                      <Alert variant="outlined" severity="info">
                        <FormattedMessage id="ui.liveStreamRoom.hostDisableVideo" defaultMessage="ui.liveStreamRoom.hostDisableVideo" />
                      </Alert>
                    )}
                  </Stack>
                )}
                {endPrejoinContent}
              </Box>
            </>
          ) : (
            <Box className={classes.conference}>
              <LiveStreamContext.Provider value={{liveStream: scLiveStream}}>
                <LiveStreamVideoConference
                  connectionDetails={connectionDetails}
                  userChoices={preJoinChoices}
                  {...LiveStreamVideoConferenceComponentProps}
                />
              </LiveStreamContext.Provider>
            </Box>
          )}
        </Box>
      )}
    </Root>
  );
}
