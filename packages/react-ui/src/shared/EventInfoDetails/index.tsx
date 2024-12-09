import {Box, Icon, Stack, styled, Tooltip, Typography, useThemeProps} from '@mui/material';
import {Link, useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventPrivacyType, SCEventRecurrenceType, SCEventType} from '@selfcommunity/types';
import {ReactNode, useMemo} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

const PREFIX = 'SCEventInfoDetails';

const classes = {
  root: `${PREFIX}-root`,
  iconTextWrapper: `${PREFIX}-icon-text-wrapper`,
  inProgress: `${PREFIX}-in-progress`,
  link: `${PREFIX}-link`,
  url: `${PREFIX}-url`,
  creationWrapper: `${PREFIX}-creation-wrapper`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EventInfoDetailsProps {
  event: SCEventType;
  eventId?: number;
  hideDateIcon?: boolean;
  hideRecurringIcon?: boolean;
  hidePrivacyIcon?: boolean;
  hideLocationIcon?: boolean;
  hideCreatedIcon?: boolean;
  hasDateInfo?: boolean;
  hasRecurringInfo?: boolean;
  hasPrivacyInfo?: boolean;
  hasLocationInfo?: boolean;
  hasCreatedInfo?: boolean;
  hasInProgress?: boolean;
  beforeDateInfo?: ReactNode | null;
  beforeRecurringInfo?: ReactNode | null;
  beforePrivacyInfo?: ReactNode | null;
  beforeLocationInfo?: ReactNode | null;
  beforeCreatedInfo?: ReactNode | null;
}

export default function EventInfoDetails(inProps: EventInfoDetailsProps) {
  // PROPS
  const props: EventInfoDetailsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    event,
    eventId,
    hideDateIcon = false,
    hideRecurringIcon = false,
    hidePrivacyIcon = false,
    hideLocationIcon = false,
    hideCreatedIcon = false,
    hasDateInfo = true,
    hasRecurringInfo = false,
    hasPrivacyInfo = true,
    hasLocationInfo = true,
    hasCreatedInfo = false,
    hasInProgress = false,
    beforeDateInfo,
    beforeRecurringInfo,
    beforePrivacyInfo,
    beforeLocationInfo,
    beforeCreatedInfo
  } = props;

  // HOOKS
  const intl = useIntl();
  const {scEvent} = useSCFetchEvent({id: eventId, event, autoSubscribe: false});

  const privacy = useMemo(
    () => (scEvent && scEvent.privacy === SCEventPrivacyType.PUBLIC ? 'ui.eventInfoDetails.privacy.public' : 'ui.eventInfoDetails.privacy.private'),
    [scEvent]
  );
  const location = useMemo(
    () =>
      scEvent && scEvent.location === SCEventLocationType.ONLINE ? 'ui.eventInfoDetails.location.virtual' : 'ui.eventInfoDetails.location.inPerson',
    [scEvent]
  );

  if (!scEvent) {
    return null;
  }

  return (
    <Root className={classes.root}>
      {beforeDateInfo}
      {hasDateInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hideDateIcon && <Icon fontSize="small">{scEvent.active ? 'CalendarIcon' : 'calendar_off'}</Icon>}
          <Tooltip
            title={
              !scEvent.active ? (
                <FormattedMessage id="ui.eventInfoDetails.deleted.tooltip" defaultMessage="ui.eventInfoDetails.deleted.tooltip" />
              ) : null
            }>
            <Typography variant="body1">
              <FormattedMessage
                id="ui.eventInfoDetails.date.startEndTime"
                defaultMessage="ui.eventInfoDetails.date.startEndTime"
                values={{
                  date: intl.formatDate(
                    scEvent.running ? scEvent.running_start_date : scEvent.next_start_date ? scEvent.next_start_date : scEvent.start_date,
                    {
                      weekday: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      month: 'long'
                    }
                  ),
                  start: intl.formatDate(
                    scEvent.running ? scEvent.running_start_date : scEvent.next_start_date ? scEvent.next_start_date : scEvent.start_date,
                    {hour: 'numeric', minute: 'numeric'}
                  )
                }}
              />
            </Typography>
          </Tooltip>
          {hasInProgress && scEvent.active && scEvent.running && (
            <Tooltip title={<FormattedMessage id="ui.eventInfoDetails.inProgress" defaultMessage="ui.eventInfoDetails.inProgress" />}>
              <Box className={classes.inProgress} />
            </Tooltip>
          )}
        </Stack>
      )}
      {beforeRecurringInfo}
      {hasRecurringInfo && scEvent.recurring !== SCEventRecurrenceType.NEVER && (
        <Stack className={classes.iconTextWrapper}>
          {!hideRecurringIcon && <Icon fontSize="small">frequency</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id={`ui.eventInfoDetails.frequency.${scEvent.recurring}.placeholder`}
              defaultMessage={`ui.eventInfoDetails.frequency.${scEvent.recurring}.placeholder`}
            />
          </Typography>
        </Stack>
      )}
      {beforePrivacyInfo}
      {hasPrivacyInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hidePrivacyIcon && <Icon fontSize="small">{scEvent.privacy === SCEventPrivacyType.PUBLIC ? 'public' : 'private'}</Icon>}
          <Typography variant="body1">
            <FormattedMessage id={privacy} defaultMessage={privacy} />
          </Typography>
          -
          <Typography variant="body1">
            <FormattedMessage id={location} defaultMessage={location} />
          </Typography>
        </Stack>
      )}
      {beforeLocationInfo}
      {hasLocationInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hideLocationIcon && (
            <Icon fontSize="small">{scEvent.location === SCEventLocationType.ONLINE ? 'play_circle_outline' : 'add_location_alt'}</Icon>
          )}
          {scEvent.location === SCEventLocationType.ONLINE ? (
            <Link to={scEvent.link} target="_blank" className={classes.link}>
              <Typography variant="body1" className={classes.url}>
                {scEvent.link}
              </Typography>
            </Link>
          ) : (
            <Typography variant="body1" className={classes.url}>
              {scEvent.geolocation}
            </Typography>
          )}
        </Stack>
      )}
      {beforeCreatedInfo}
      {hasCreatedInfo && (
        <Stack className={classes.creationWrapper}>
          {!hideCreatedIcon && <Icon fontSize="small">create</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id="ui.eventInfoDetails.date.create"
              defaultMessage="ui.eventInfoDetails.date.create"
              values={{
                date: intl.formatDate(scEvent.created_at, {
                  weekday: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long'
                })
              }}
            />
          </Typography>
        </Stack>
      )}
    </Root>
  );
}
