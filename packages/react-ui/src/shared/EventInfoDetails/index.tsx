import { Icon, Stack, styled, Typography, useThemeProps } from '@mui/material';
import { Link } from '@selfcommunity/react-core';
import { SCEventLocationType, SCEventPrivacyType, SCEventRecurrenceType, SCEventType } from '@selfcommunity/types';
import { ReactNode, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const PREFIX = 'SCEventInfoDetails';

const classes = {
  root: `${PREFIX}-root`,
  iconTextWrapper: `${PREFIX}-icon-text-wrapper`,
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
    beforeDateInfo,
    beforeRecurringInfo,
    beforePrivacyInfo,
    beforeLocationInfo,
    beforeCreatedInfo
  } = props;

  // HOOKS
  const intl = useIntl();

  const privacy = useMemo(
    () => (event.privacy === SCEventPrivacyType.PUBLIC ? 'ui.eventInfoDetails.privacy.public' : 'ui.eventInfoDetails.privacy.private'),
    [event]
  );
  const location = useMemo(
    () => (event.location === SCEventLocationType.ONLINE ? 'ui.eventInfoDetails.location.virtual' : 'ui.eventInfoDetails.location.inPerson'),
    [event]
  );

  return (
    <Root className={classes.root}>
      {beforeDateInfo}
      {hasDateInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hideDateIcon && <Icon fontSize="small">CalendarIcon</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id="ui.eventInfoDetails.date.startEndTime"
              defaultMessage="ui.eventInfoDetails.date.startEndTime"
              values={{
                date: intl.formatDate(event.running ? event.running_start_date : event.next_start_date, {
                  weekday: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long'
                }),
                start: intl.formatDate(event.running ? event.running_start_date : event.next_start_date, { hour: 'numeric', minute: 'numeric' })
              }}
            />
          </Typography>
        </Stack>
      )}
      {beforeRecurringInfo}
      {hasRecurringInfo && event.recurring !== SCEventRecurrenceType.NEVER && (
        <Stack className={classes.iconTextWrapper}>
          {!hideRecurringIcon && <Icon fontSize="small">frequency</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id={`ui.eventInfoDetails.frequency.${event.recurring}.placeholder`}
              defaultMessage={`ui.eventInfoDetails.frequency.${event.recurring}.placeholder`}
            />
          </Typography>
        </Stack>
      )}
      {beforePrivacyInfo}
      {hasPrivacyInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hidePrivacyIcon && <Icon fontSize="small">{event.privacy === SCEventPrivacyType.PUBLIC ? 'public' : 'private'}</Icon>}
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
            <Icon fontSize="small">{event.location === SCEventLocationType.ONLINE ? 'play_circle_outline' : 'add_location_alt'}</Icon>
          )}
          {event.location === SCEventLocationType.ONLINE ? (
            <Link to={event.link} target="_blank" className={classes.link}>
              <Typography variant="body1" className={classes.url}>
                {event.link}
              </Typography>
            </Link>
          ) : (
            <Typography variant="body1" className={classes.url}>
              {event.geolocation}
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
                date: intl.formatDate(event.created_at, {
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
