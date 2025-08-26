import {useEffect, useMemo, useRef, useState} from 'react';
import {styled, Box} from '@mui/material';
import {
  ContributionUtils,
  EventInfoWidget,
  EventLocationWidget,
  EventMediaWidget,
  EventMembersWidget,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedProps,
  FeedRef,
  FeedSidebarProps,
  InlineComposerWidget,
  RelatedEventsWidget,
  SCFeedObjectTemplateType,
  SCFeedWidgetType,
  shouldAddFeedData
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {
  Link,
  SCRoutes,
  SCRoutingContextType,
  SCSubscribedEventsManagerType,
  SCUserContextType,
  useSCFetchEvent,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCCustomAdvPosition, SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType, SCFeedTypologyType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {PREFIX} from './constants';
import EventFeedSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventFeedProps {
  /**
   * Id of the feed object
   * @default 'feed'
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
   * Id of the event for filter the feed
   * @default null
   */
  eventId?: number;

  /**
   * Widgets to be rendered into the feed
   * @default [EventInfoWidget]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to feed component
   * @default {}
   */
  FeedProps?: Omit<
    FeedProps,
    'endpoint' | 'widgets' | 'ItemComponent' | 'itemPropsGenerator' | 'itemIdGenerator' | 'ItemSkeleton' | 'ItemSkeletonProps' | 'FeedSidebarProps'
  >;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: EventLocationWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: EventMembersWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: EventMediaWidget,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: RelatedEventsWidget,
    componentProps: {},
    column: 'right',
    position: 3
  }
];

/**
 * > API documentation for the Community-JS Group Feed Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific event's feed.

 #### Import

 ```jsx
 import {EventFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCEventFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function EventFeed(inProps: EventFeedProps): JSX.Element {
  // PROPS
  const props: EventFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'event_feed', className, event, eventId, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null, FeedProps = {}} = props;

  // STATUS
  const [status, setStatus] = useState<string | null | undefined>(undefined);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const scEventsManager: SCSubscribedEventsManagerType = scUserContext.managers.events;
  const {enqueueSnackbar} = useSnackbar();
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  // REF
  const feedRef = useRef<FeedRef>();

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  useEffect(() => {
    /**
     * Call scEventsManager.subscriptionStatus inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setStatus(scEventsManager?.subscriptionStatus(scEvent));
    }
  }, [authUserId, scEventsManager?.subscriptionStatus, scEvent]);

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    const messageId = feedObject.scheduled_at ? 'ui.composer.scheduled.success' : 'ui.composerIconButton.composer.success';
    enqueueSnackbar(<FormattedMessage id={messageId} defaultMessage={messageId} />, {
      action: () => (
        <Link to={scRoutingContext.url(SCRoutes[`${feedObject.type.toUpperCase()}_ROUTE_NAME`], ContributionUtils.getRouteData(feedObject))}>
          <FormattedMessage id="ui.composerIconButton.composer.viewContribute" defaultMessage="ui.composerIconButton.composer.viewContribute" />
        </Link>
      ),
      variant: 'success',
      autoHideDuration: 7000
    });
    if (feedObject.event?.id === scEvent.id) {
      // Hydrate feedUnit
      const feedUnit = {
        type: feedObject.type,
        [feedObject.type]: feedObject,
        seen_by_id: [],
        has_boost: false
      };
      shouldAddFeedData(feedObject) && feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit, true);
    }
  };

  // WIDGETS
  const _widgets = useMemo(
    () =>
      widgets.map((w) => {
        if (scEvent) {
          return {...w, componentProps: {...w.componentProps, event: scEvent}};
        }
        return w;
      }),
    [widgets, scEvent]
  );

  if (
    scUserContext.user === undefined ||
    (scUserContext.user && status === undefined) ||
    !scEvent ||
    (scUserContext.user && scEvent.privacy === SCEventPrivacyType.PUBLIC && !status) ||
    (scEvent && ((eventId !== undefined && scEvent.id !== eventId) || (event && scEvent.id !== event.id)))
  ) {
    return <EventFeedSkeleton />;
  } else if (
    scEvent.privacy === SCEventPrivacyType.PRIVATE &&
    (status === SCEventSubscriptionStatusType.INVITED ||
      (status !== SCEventSubscriptionStatusType.SUBSCRIBED &&
        status !== SCEventSubscriptionStatusType.GOING &&
        status !== SCEventSubscriptionStatusType.NOT_GOING))
  ) {
    return (
      <Box mt={2}>
        <EventInfoWidget className={classes.root} event={scEvent} />
      </Box>
    );
  }

  return (
    <Root
      className={classNames(classes.root, className)}
      id={id}
      ref={feedRef}
      endpoint={{
        ...Endpoints.GetEventFeed,
        url: () => Endpoints.GetEventFeed.url({id: scEvent.id})
      }}
      widgets={_widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null,
        markRead: scUser ? !item?.seen_by_id?.includes(scUser.id) : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
      HeaderComponent={
        <>
          <EventInfoWidget className={classes.root} event={scEvent} />
          {Boolean(
            scEvent &&
              ((!scUserContext.user && scEvent.privacy === SCEventPrivacyType.PUBLIC) ||
                (scUserContext.user &&
                  (status === SCEventSubscriptionStatusType.SUBSCRIBED ||
                    status === SCEventSubscriptionStatusType.GOING ||
                    status === SCEventSubscriptionStatusType.NOT_GOING)))
          ) && (
            <InlineComposerWidget
              onSuccess={handleComposerSuccess}
              defaultValue={{event: scEvent}}
              label={<FormattedMessage id="templates.eventFeed.composer.label" defaultMessage="templates.eventFeed.composer.label" />}
              feedType={SCFeedTypologyType.EVENT}
            />
          )}
        </>
      }
      CustomAdvProps={{position: SCCustomAdvPosition.POSITION_FEED, groupsId: [scEvent.id]}}
      enabledCustomAdvPositions={[
        SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
        SCCustomAdvPosition.POSITION_FEED,
        SCCustomAdvPosition.POSITION_BELOW_TOPBAR
      ]}
      {...FeedProps}
    />
  );
}
