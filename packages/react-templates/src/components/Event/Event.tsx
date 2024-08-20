import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, EventHeader, SCFeedWidgetType, EventLocationWidget} from '@selfcommunity/react-ui';
import {useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventLocationType, SCEventType} from '@selfcommunity/types';
import EventSkeletonTemplate from './Skeleton';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from './constants';
import EventFeed, {EventFeedProps} from '../EventFeed';

const classes = {
  root: `${PREFIX}-root`,
  feed: `${PREFIX}-feed`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EventProps {
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
   * @default []
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
   * Props to spread to EventFeed component
   * @default {}
   */
  EventFeedProps?: EventFeedProps;
}
/**
 * > API documentation for the Community-JS Category Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific event's template.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/Group)

 #### Import

 ```jsx
 import {Group} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCGroupTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupTemplate-root|Styles applied to the root element.|
 |feed|.SCGroupTemplate-feed|Styles applied to the feed element.|
 *
 * @param inProps
 */
export default function Event(inProps: EventProps): JSX.Element {
  // PROPS
  const props: EventProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'event', className, event, eventId, widgets, FeedObjectProps, FeedSidebarProps, EventFeedProps = {}} = props;

  // HOOKS
  const {scEvent, setSCEvent} = useSCFetchEvent({id: eventId, event});

  const handleSubscribe = (group, status) => {
    setSCEvent(Object.assign({}, scEvent, {subscription_status: status}));
  };

  if (!scEvent) {
    return <EventSkeletonTemplate />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <EventHeader eventId={scEvent.id} GroupSubscribeButtonProps={{onSubscribe: handleSubscribe}} />
      <Grid container spacing={2} mt={2}>
        {scEvent.location === SCEventLocationType.PERSON ? (
          <>
            <Grid item xs={12} md={7}>
              {/* <EventInfoWidget scEvent={scEvent} /> */}
            </Grid>
            <Grid item xs={12} md={5}>
              <EventLocationWidget event={scEvent} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            {/* <EventInfoWidget scEvent={scEvent} /> */}
          </Grid>
        )}
      </Grid>
      <EventFeed
        className={classes.feed}
        event={scEvent}
        widgets={widgets}
        FeedObjectProps={FeedObjectProps}
        FeedSidebarProps={FeedSidebarProps}
        {...EventFeedProps}
      />
    </Root>
  );
}
