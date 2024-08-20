import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Icon, Paper, Typography} from '@mui/material';
import {SCEventLocationType, SCEventPrivacyType, SCEventType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCFetchEvent, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import EventHeaderSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../shared/Bullet';
import EventSubscribeButton, {EventSubscribeButtonProps} from '../EventSubscribeButton';
import EventInviteButton from '../EventInviteButton';
import {SCEventMembersEventType, SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';
import EditEventButton from '../EditEventButton';
import User from '../User';
import Calendar from '../../shared/Calendar';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  time: `${PREFIX}-time`,
  calendar: `${PREFIX}-calendar`,
  info: `${PREFIX}-info`,
  name: `${PREFIX}-name`,
  visibility: `${PREFIX}-visibility`,
  visibilityItem: `${PREFIX}-visibility-item`,
  multiActions: `${PREFIX}-multi-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
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
   * Props to spread event button followed
   * @default {}
   */
  EventSubscribeButtonProps?: EventSubscribeButtonProps;

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
  const {id = null, className = null, event, eventId = null, EventSubscribeButtonProps = {}, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scEvent, setSCEvent} = useSCFetchEvent({id: eventId, event});

  // INTL
  const intl = useIntl();

  // REFS
  const updatesSubscription = useRef(null);

  // CONST
  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  /**
   * Subscriber for pubsub callback
   */
  const onChangeEventMembersHandler = useCallback(
    (msg: string, data: SCEventMembersEventType) => {
      if (data && data?.event?.id === scEvent?.id) {
        let _event = {...scEvent};
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
      ? {background: `url('${scEvent.image_bigger}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <Box className={classes.calendar}>
          <Calendar day={new Date(scEvent.start_date).getDate()} />
        </Box>
      </Paper>
      <Box className={classes.info}>
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
                  startTime: intl.formatDate(scEvent.start_date, {hour: 'numeric', minute: 'numeric'}),
                  endTime: intl.formatDate(scEvent.end_date, {hour: 'numeric', minute: 'numeric'})
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
                  start: intl.formatDate(scEvent.start_date, {hour: 'numeric', minute: 'numeric'}),
                  end: intl.formatDate(scEvent.end_date, {hour: 'numeric', minute: 'numeric'})
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
                hour: intl.formatDate(scEvent.start_date, {hour: 'numeric', minute: 'numeric'})
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
          userId={scEvent?.managed_by?.id}
          elevation={0}
          actions={
            <>
              {isEventAdmin ? (
                <Box className={classes.multiActions}>
                  <EventInviteButton size="small" event={scEvent} eventId={scEvent.id} />
                  <EditEventButton size="small" event={scEvent} eventId={scEvent.id} onEditSuccess={(data: SCEventType) => setSCEvent(data)} />
                </Box>
              ) : (
                <EventSubscribeButton event={scEvent} {...EventSubscribeButtonProps} />
              )}
            </>
          }
        />
      </Box>
    </Root>
  );
}