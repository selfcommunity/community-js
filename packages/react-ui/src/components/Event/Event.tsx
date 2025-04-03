import {Avatar, Box, Button, CardActions, CardContent, CardMedia, Chip, Divider, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchEvent, useSCRouting} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import classNames from 'classnames';
import React, {useMemo} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import BaseItem from '../../shared/BaseItem';
import Calendar from '../../shared/Calendar';
import EventInfoDetails from '../../shared/EventInfoDetails';
import {SCEventTemplateType} from '../../types/event';
import EventParticipantsButton, {EventParticipantsButtonProps} from '../EventParticipantsButton';
import User from '../User';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import EventSkeleton, {EventSkeletonProps} from './Skeleton';
import {checkEventFinished} from '../../utils/events';

const classes = {
  root: `${PREFIX}-root`,
  detailRoot: `${PREFIX}-detail-root`,
  previewRoot: `${PREFIX}-preview-root`,
  snippetRoot: `${PREFIX}-snippet-root`,
  detailImageWrapper: `${PREFIX}-detail-image-wrapper`,
  detailImage: `${PREFIX}-detail-image`,
  detailInProgress: `${PREFIX}-detail-in-progress`,
  detailNameWrapper: `${PREFIX}-detail-name-wrapper`,
  detailName: `${PREFIX}-detail-name`,
  detailContent: `${PREFIX}-detail-content`,
  detailUser: `${PREFIX}-detail-user`,
  detailFirstDivider: `${PREFIX}-detail-first-divider`,
  detailSecondDivider: `${PREFIX}-detail-second-divider`,
  detailActions: `${PREFIX}-detail-actions`,
  previewImageWrapper: `${PREFIX}-preview-image-wrapper`,
  previewImage: `${PREFIX}-preview-image`,
  previewInProgress: `${PREFIX}-preview-in-progress`,
  previewNameWrapper: `${PREFIX}-preview-name-wrapper`,
  previewName: `${PREFIX}-preview-name`,
  previewContent: `${PREFIX}-preview-content`,
  previewActions: `${PREFIX}-preview-actions`,
  snippetImage: `${PREFIX}-snippet-image`,
  snippetAvatar: `${PREFIX}-snippet-avatar`,
  snippetInProgress: `${PREFIX}-snippet-in-progress`,
  snippetPrimary: `${PREFIX}-snippet-primary`,
  snippetSecondary: `${PREFIX}-snippet-secondary`,
  snippetActions: `${PREFIX}-snippet-actions`,
  finishedChip: `${PREFIX}-finished-chip`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const DetailRoot = styled(Box, {
  name: PREFIX,
  slot: 'DetailRoot',
  overridesResolver: (_props, styles) => styles.detailRoot
})(() => ({}));

const PreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot',
  overridesResolver: (_props, styles) => styles.previewRoot
})(() => ({}));

const SnippetRoot = styled(BaseItem, {
  name: PREFIX,
  slot: 'SnippetRoot',
  overridesResolver: (_props, styles) => styles.snippetRoot
})(() => ({}));

export interface EventProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;
  /**
   * Id of the event for filter the feed
   * @default null
   */
  eventId?: number;
  /**
   * Event template type
   * @default 'preview'
   */
  template?: SCEventTemplateType;
  /**
   * Actions
   * @default null
   */
  actions?: React.ReactNode;
  /**
   * Hide in progress
   * @default false
   */
  hideInProgress?: boolean;
  /**
   * Hide participants
   * @default false
   */
  hideEventParticipants?: boolean;
  /**
   * Props to spread to EventParticipantsButton component
   * @default {}
   */
  EventParticipantsButtonComponentProps?: EventParticipantsButtonProps;
  /**
   * Hide event planner
   * @default false
   */
  hideEventPlanner?: boolean;
  /**
   * Props to spread to EventSkeleton component
   * @default {}
   */
  EventSkeletonComponentProps?: EventSkeletonProps;
  /**
   * Override default cache strategy on fetch element
   */
  cacheStrategy?: CacheStrategies;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Event component. Learn about the available props and the CSS API.
 *
 *
 * This component renders an event item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Event)

 #### Import

 ```jsx
 import {event} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEvent` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEvent-root|Styles applied to the root element.|
 |avatar|.SCEvent-avatar|Styles applied to the avatar element.|
 |primary|.SCEvent-primary|Styles applied to the primary item element section|
 |secondary|.SCEvent-secondary|Styles applied to the secondary item element section|
 |actions|.SCEvent-actions|Styles applied to the actions section.|


 *
 * @param inProps
 */
export default function Event(inProps: EventProps): JSX.Element {
  // PROPS
  const props: EventProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `event_object_${props.eventId ? props.eventId : props.event ? props.event.id : ''}`,
    eventId = null,
    event = null,
    className = null,
    template = SCEventTemplateType.SNIPPET,
    hideInProgress = false,
    hideEventParticipants = false,
    hideEventPlanner = false,
    actions,
    EventParticipantsButtonComponentProps = {},
    EventSkeletonComponentProps = {},
    cacheStrategy,
    ...rest
  } = props;

  // STATE
  const {scEvent} = useSCFetchEvent({id: eventId, event, autoSubscribe: false, ...(cacheStrategy && {cacheStrategy})});
  const inProgress = useMemo(() => scEvent && scEvent.active && scEvent.running, [scEvent]);
  const isEventFinished = useMemo(() => checkEventFinished(scEvent), [scEvent]);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();
  /**
   * Renders event object
   */
  if (!scEvent) {
    return <EventSkeleton template={template} {...EventSkeletonComponentProps} {...rest} actions={actions} />;
  }

  /**
   * Renders event object
   */
  let contentObj: React.ReactElement;
  if (template === SCEventTemplateType.DETAIL) {
    contentObj = (
      <DetailRoot className={classes.detailRoot}>
        <Box className={classes.detailImageWrapper}>
          <CardMedia component="img" image={scEvent.image_medium} alt={scEvent.name} className={classes.detailImage} />
          {!hideInProgress && inProgress && (
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.event.inProgress" defaultMessage="ui.event.inProgress" />}
              className={classes.detailInProgress}
            />
          )}
          <Calendar day={new Date(scEvent.start_date).getDate()} />
        </Box>
        <CardContent className={classes.detailContent}>
          {scEvent.active ? (
            <Link to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)} className={classes.detailNameWrapper}>
              <Typography variant="h3" className={classes.detailName}>
                {scEvent.name}
              </Typography>
            </Link>
          ) : (
            <Box className={classes.detailNameWrapper}>
              <Typography variant="h3" className={classes.detailName}>
                {scEvent.name}
              </Typography>
            </Box>
          )}
          <EventInfoDetails event={scEvent} />
          {!hideEventPlanner && (
            <User
              user={scEvent.managed_by}
              elevation={0}
              secondary={
                <Typography variant="caption">
                  <FormattedMessage id="ui.myEventsWidget.planner" defaultMessage="ui.myEventsWidget.planner" />
                </Typography>
              }
              actions={<></>}
              className={classes.detailUser}
            />
          )}
          {!hideEventParticipants && (
            <>
              <Divider className={classes.detailFirstDivider} />
              <EventParticipantsButton event={scEvent} {...EventParticipantsButtonComponentProps} />
            </>
          )}
          <Divider className={classes.detailSecondDivider} />
        </CardContent>
        {actions ?? (
          <CardActions className={classes.detailActions}>
            <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)}>
              <FormattedMessage defaultMessage="ui.event.see" id="ui.event.see" />
            </Button>
          </CardActions>
        )}
      </DetailRoot>
    );
  } else if (template === SCEventTemplateType.PREVIEW) {
    contentObj = (
      <PreviewRoot className={classes.previewRoot}>
        <Box position="relative" className={classes.previewImageWrapper}>
          <CardMedia component="img" image={scEvent.image_medium} alt={scEvent.name} className={classes.previewImage} />
          {!hideInProgress && inProgress && (
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.event.inProgress" defaultMessage="ui.event.inProgress" />}
              className={classes.previewInProgress}
            />
          )}
          {isEventFinished && (
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.event.finished" defaultMessage="ui.event.finished" />}
              className={classes.finishedChip}
            />
          )}
        </Box>
        <CardContent className={classes.previewContent}>
          <EventInfoDetails
            event={scEvent}
            hidePrivacyIcon
            hasLocationInfo={false}
            beforePrivacyInfo={
              <Link to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)} className={classes.previewNameWrapper}>
                <Typography variant="h5" className={classes.previewName}>
                  {scEvent.name}
                </Typography>
              </Link>
            }
          />
          {!hideEventParticipants && <EventParticipantsButton event={scEvent} hideCaption {...EventParticipantsButtonComponentProps} />}
        </CardContent>
        {actions ?? (
          <CardActions className={classes.previewActions}>
            <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)}>
              <FormattedMessage defaultMessage="ui.event.see" id="ui.event.see" />
            </Button>
          </CardActions>
        )}
      </PreviewRoot>
    );
  } else {
    contentObj = (
      <SnippetRoot
        elevation={0}
        square={true}
        disableTypography
        className={classes.snippetRoot}
        image={
          <Box className={classes.snippetImage}>
            <Avatar variant="square" alt={scEvent.name} src={scEvent.image_medium} className={classes.snippetAvatar} />{' '}
            {!hideInProgress && inProgress && (
              <Chip
                size="small"
                component="div"
                label={<FormattedMessage id="ui.event.inProgress" defaultMessage="ui.event.inProgress" />}
                className={classes.snippetInProgress}
              />
            )}
            {isEventFinished && (
              <Chip
                size="small"
                component="div"
                label={<FormattedMessage id="ui.event.finished" defaultMessage="ui.event.finished" />}
                className={classes.finishedChip}
              />
            )}
          </Box>
        }
        primary={
          <Link to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)} className={classes.snippetPrimary}>
            <Typography component="span">{`${intl.formatDate(scEvent.start_date, {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}`}</Typography>
            <Typography variant="body1">{scEvent.name}</Typography>
          </Link>
        }
        secondary={
          <Typography component="p" variant="body2" className={classes.snippetSecondary}>
            <FormattedMessage id={`ui.eventForm.privacy.${scEvent.privacy}`} defaultMessage={`ui.eventForm.privacy.${scEvent.privacy}`} /> -{' '}
            {scEvent?.location === SCEventLocationType.PERSON ? (
              <FormattedMessage id={`ui.eventForm.address.live.label`} defaultMessage={`ui.eventForm.address.live.label`} />
            ) : (
              <FormattedMessage id={`ui.eventForm.address.online.label`} defaultMessage={`ui.eventForm.address.online.label`} />
            )}
          </Typography>
        }
        actions={
          actions ?? (
            <Box className={classes.snippetActions}>
              <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)}>
                <FormattedMessage defaultMessage="ui.event.see" id="ui.event.see" />
              </Button>
            </Box>
          )
        }
      />
    );
  }
  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
