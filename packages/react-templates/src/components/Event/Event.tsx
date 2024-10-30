import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, EventHeader, SCFeedWidgetType, EventHeaderProps} from '@selfcommunity/react-ui';
import {SCUserContextType, useSCFetchEvent, useSCUser} from '@selfcommunity/react-core';
import {SCEventType} from '@selfcommunity/types';
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

  /**
   * Props to spread EventHeader component
   * @default {}
   */
  EventHeaderProps?: EventHeaderProps;
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
  const {id = 'event', className, event, eventId, widgets, FeedObjectProps, FeedSidebarProps, EventFeedProps = {}, EventHeaderProps = {}} = props;

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  if (!scEvent) {
    return <EventSkeletonTemplate />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <EventHeader event={scEvent} {...EventHeaderProps} />
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
