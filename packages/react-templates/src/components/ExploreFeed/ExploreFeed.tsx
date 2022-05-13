import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  CategoriesPopular,
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  SCFeedObjectTemplateType,
  FeedRef,
  FeedSidebarProps,
  InlineComposer,
  LoyaltyProgram,
  PeopleSuggestion,
  Platform,
  SCFeedWidgetType
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import useThemeProps from '@mui/material/styles/useThemeProps';
import classNames from 'classnames';

const PREFIX = 'SCExploreFeedTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface ExploreFeedProps {
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
   * Widgets to be rendered into the feed
   * @default [CategoriesFollowed, UserFollowed]
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
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: InlineComposer,
    componentProps: {},
    column: 'left',
    position: 0
  },
  {
    type: 'widget',
    component: Platform,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: LoyaltyProgram,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: CategoriesPopular,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: PeopleSuggestion,
    componentProps: {},
    column: 'right',
    position: 3
  }
];

/**
 * > API documentation for the Community-JS Explore Feed Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ExploreFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCExploreFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCExploreFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function ExploreFeed(inProps: ExploreFeedProps): JSX.Element {
  // PROPS
  const props: ExploreFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'explore_feed', className, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null} = props;

  // STATE
  const [_widgets, setWidgets] = useState<SCFeedWidgetType[]>([]);

  // REF
  const feedRef = useRef<FeedRef>();

  // EFFECTS
  useEffect(() => {
    setWidgets(
      widgets.map((w) => {
        if (w.component === InlineComposer) {
          return {...w, componentProps: {...w.componentProps, onSuccess: handleComposerSuccess}};
        }
        return {...w, componentProps: {...w.componentProps}};
      })
    );
  }, [widgets]);

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    // Hydrate feedUnit
    const feedUnit = {
      type: feedObject.type,
      [feedObject.type]: feedObject,
      seen_by_id: [],
      has_boost: false
    };
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit);
  };

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={feedRef}
      endpoint={Endpoints.ExploreFeed}
      widgets={_widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null,
        markRead: scUser ? !item.seen_by_id.includes(scUser.id) : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      FeedSidebarProps={FeedSidebarProps}
    />
  );
}
