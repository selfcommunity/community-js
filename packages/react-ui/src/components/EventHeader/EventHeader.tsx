import { Box, Chip, Icon, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeProps } from '@mui/system';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchEvent,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import { SCEventLocationType, SCEventPrivacyType, SCEventType } from '@selfcommunity/types';
import classNames from 'classnames';
import PubSub from 'pubsub-js';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SCEventMembersEventType, SCGroupEventType, SCTopicType } from '../../constants/PubSub';
import Bullet from '../../shared/Bullet';
import Calendar from '../../shared/Calendar';
import EventActionsMenu, { EventActionsMenuProps } from '../../shared/EventActionsMenu';
import EditEventButton from '../EditEventButton';
import EventInviteButton from '../EventInviteButton';
import EventSubscribeButton, { EventSubscribeButtonProps } from '../EventSubscribeButton';
import User from '../User';
import { PREFIX } from './constants';
import EventHeaderSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  time: `${PREFIX}-time`,
  calendar: `${PREFIX}-calendar`,
  inProgress: `${PREFIX}-in-progress`,
  chip: `${PREFIX}-chip`,
  chipIcon: `${PREFIX}-chip-icon`,
  info: `${PREFIX}-info`,
  name: `${PREFIX}-name`,
  visibility: `${PREFIX}-visibility`,
  visibilityItem: `${PREFIX}-visibility-item`,
  planner: `${PREFIX}-planner`,
  multiActions: `${PREFIX}-multi-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  shouldForwardProp: (prop) => prop !== 'isEventAdmin' && prop !== 'isEventFinished'
})(() => ({}));

export interface EventHeaderProps {
  /**
   * Id of event object
   * @default null
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the event
   * @default null
   */
  eventId?: number;
  /**
   * Props to spread event button
   * @default {}
   */
  EventSubscribeButtonProps?: EventSubscribeButtonProps;
  /**
   * Props to spread event actions menu
   * @default {}
   */
  EventActionsProps?: Omit<EventActionsMenuProps, 'event'>;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Event Header component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the events top section.

 #### Import

 ```jsx
 import {UserProfileHeader} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventHeader-root|Styles applied to the root element.|
 |cover|.SCEventHeader-cover|Styles applied to the cover element.|
 |time|.SCEventHeader-time|Styles applied to the time element.|
 |calendar|.SCEventHeader-calendar|Styles applied to the calendar element.|
 |info|SCEventHeader-info|Styles applied to the info section.|
 |name|SCEventHeader-username|Styles applied to the username element.|
 |visibility|SCEventHeader-visibility|Styles applied to the visibility section.|
 |visibilityItem|SCEventHeader-visibility-item|Styles applied to the visibility element.|
 |multiActions|SCEventHeader-multi-action|Styles applied to the multi actions section.|

 * @param inProps
 */
export default function EventHeader(inProps: EventHeaderProps): JSX.Element {
  // PROPS
  const props: EventHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const { id = null, className = null, event, eventId = null, EventSubscribeButtonProps = {}, EventActionsProps = {}, ...rest } = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const { scEvent, setSCEvent } = useSCFetchEvent({ id: eventId, event });
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // INTL
  const intl = useIntl();

  // REFS
  const updatesSubscription = useRef(null);

  // CONST
  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  const isEventFinished = useMemo(() => {
    if (scEvent && !scEvent.running) {
      return new Date().getTime() > new Date(scEvent.end_date || scEvent.start_date).getTime();
    }

    return false;
  }, [scEvent]);

  /**
   * Subscriber for pubsub callback
   */
  const onChangeEventMembersHandler = useCallback(
    (msg: string, data: SCEventMembersEventType) => {
      if (data && data?.event?.id === scEvent?.id) {
        let _event = { ...scEvent };
        if (msg === `${SCTopicType.GROUP}.${SCGroupEventType.ADD_MEMBER}`) {
          _event.subscribers_counter = _event.subscribers_counter + 1;
        } else if (msg === `${SCTopicType.GROUP}.${SCGroupEventType.REMOVE_MEMBER}`) {
          _event.subscribers_counter = Math.max(_event.subscribers_counter - 1, 0);
        }
        setSCEvent(_event);
      }
    },
    [scEvent, setSCEvent]
  );

  /**
   * Handles callback subscribe/unsubscribe event
   */
  const handleSubscribe = (event, status) => {
    setSCEvent(Object.assign({}, scEvent, { subscription_status: status }));
  };

  /**
   * On mount, subscribe to receive events updates (only edit)
   */
  useEffect(() => {
    if (scEvent) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.MEMBERS}`, onChangeEventMembersHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [scEvent]);

  // RENDER
  if (!scEvent) {
    return <EventHeaderSkeleton />;
  }
  const _backgroundCover = {
    ...(scEvent.image_bigger
      ? { background: `url('${scEvent.image_bigger}') center / cover` }
      : { background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover` })
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Root id={id} className={classNames(classes.root, className)} isEventAdmin={isEventAdmin} isEventFinished={isEventFinished} {...rest}>
      <Paper style={_backgroundCover} classes={{ root: classes.cover }}>
        <Box className={classes.calendar}>
          <Calendar day={new Date(scEvent.start_date).getDate()} />
        </Box>
      </Paper>
      <Box className={classes.info}>
        {scEvent.running && (
          <Typography variant="body1" className={classes.inProgress}>
            <FormattedMessage id="ui.eventHeader.inProgress" defaultMessage="ui.eventHeader.inProgress" />
          </Typography>
        )}
        {isEventFinished && (
          <Chip
            icon={
              <Icon fontSize="small" className={classes.chipIcon}>
                calendar_off
              </Icon>
            }
            label={
              <Typography variant="body1">
                <FormattedMessage id="ui.eventHeader.finished" defaultMessage="ui.eventHeader.finished" />
              </Typography>
            }
            variant="outlined"
            size="medium"
            color="secondary"
            className={classes.chip}
          />
        )}
        <Typography className={classes.time}>
          {scEvent.end_date && scEvent.end_date !== scEvent.start_date ? (
            new Date(scEvent.start_date).getDate() !== new Date(scEvent.end_date).getDate() ? (
              <FormattedMessage
                id="ui.eventHeader.startEndTimeDiff"
                defaultMessage="ui.eventHeader.startEndTimeDiff"
                values={{
                  startDate: intl.formatDate(scEvent.start_date, {
                    weekday: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                  }),
                  endDate: intl.formatDate(scEvent.end_date, {
                    weekday: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                  }),
                  startTime: intl.formatDate(scEvent.start_date, { hour: 'numeric', minute: 'numeric' }),
                  endTime: intl.formatDate(scEvent.end_date, { hour: 'numeric', minute: 'numeric' })
                }}
              />
            ) : (
              <FormattedMessage
                id="ui.eventHeader.startEndTime"
                defaultMessage="ui.eventHeader.startEndTime"
                values={{
                  date: intl.formatDate(scEvent.start_date, {
                    weekday: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    month: 'long'
                  }),
                  start: intl.formatDate(scEvent.start_date, { hour: 'numeric', minute: 'numeric' }),
                  end: intl.formatDate(scEvent.end_date, { hour: 'numeric', minute: 'numeric' })
                }}
              />
            )
          ) : (
            <FormattedMessage
              id="ui.eventHeader.dateTime"
              defaultMessage="ui.eventHeader.dateTime"
              values={{
                date: intl.formatDate(scEvent.start_date, {
                  weekday: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long'
                }),
                hour: intl.formatDate(scEvent.start_date, { hour: 'numeric', minute: 'numeric' })
              }}
            />
          )}
        </Typography>
        <Typography variant="h5" className={classes.name}>
          {scEvent.name}
        </Typography>
        <Box className={classes.visibility}>
          <>
            {scEvent.privacy === SCEventPrivacyType.PUBLIC ? (
              <Typography className={classes.visibilityItem}>
                <Icon>public</Icon>
                <FormattedMessage id="ui.eventHeader.visibility.public" defaultMessage="ui.eventHeader.visibility.public" />
              </Typography>
            ) : (
              <Typography className={classes.visibilityItem}>
                <Icon>private</Icon>
                <FormattedMessage id="ui.eventHeader.visibility.private" defaultMessage="ui.eventHeader.visibility.private" />
              </Typography>
            )}
          </>
          <Bullet />
          <Typography className={classes.visibilityItem}>
            {scEvent.location === SCEventLocationType.PERSON ? (
              <FormattedMessage id="ui.eventHeader.location.live" defaultMessage="ui.eventHeader.location.live" />
            ) : (
              <FormattedMessage id="ui.eventHeader.location.live" defaultMessage="ui.eventHeader.location.online" />
            )}
          </Typography>
        </Box>
        <User
          className={classes.planner}
          userId={scEvent?.managed_by?.id}
          secondary={<FormattedMessage id="ui.eventHeader.user.manager" defaultMessage="ui.eventHeader.user.manager" />}
          elevation={0}
          actions={
            <>
              {isEventAdmin ? (
                <Box className={classes.multiActions}>
                  <EventInviteButton size={isMobile ? 'small' : 'medium'} event={scEvent} eventId={scEvent.id} />
                  <Box>
                    <EditEventButton
                      size={isMobile ? 'small' : 'medium'}
                      event={scEvent}
                      eventId={scEvent.id}
                      onEditSuccess={(data: SCEventType) => setSCEvent(data)}
                    />
                    <EventActionsMenu event={scEvent} {...EventActionsProps} />
                  </Box>
                </Box>
              ) : (
                <>
                  <EventSubscribeButton event={scEvent} onSubscribe={handleSubscribe} {...EventSubscribeButtonProps} />
                  <EventActionsMenu event={scEvent} {...EventActionsProps} />
                </>
              )}
            </>
          }
        />
      </Box>
    </Root>
  );
}
