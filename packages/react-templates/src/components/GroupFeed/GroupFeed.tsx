import React, {useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedProps,
  FeedRef,
  FeedSidebarProps,
  GroupInfoWidget,
  GroupMembersWidget,
  InlineComposerWidget,
  SCFeedObjectTemplateType,
  SCFeedWidgetType
} from '@selfcommunity/react-ui';
import {Endpoints} from '@selfcommunity/api-services';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchGroup, useSCRouting} from '@selfcommunity/react-core';
import {SCCustomAdvPosition, SCGroupFeedType, SCGroupType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {SnackbarKey, useSnackbar} from 'notistack';
import {ContributionUtils} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';
import GroupFeedSkeleton from './Skeleton';
import {Box, Tab, Tabs} from '@mui/material';

const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  tabItem: `${PREFIX}-tab-item`,
  tabContent: `${PREFIX}-tab-content`,
  home: `${PREFIX}-home`,
  members: `${PREFIX}-members`,
  messages: `${PREFIX}-messages`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const TabRoot = styled(Tab, {
  name: PREFIX,
  slot: 'TabRoot'
})(() => ({}));

export interface GroupFeedProps {
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
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group for filter the feed
   * @default null
   */
  groupId?: number;

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

  /**
   * Props to spread to feed component
   * @default {}
   */
  FeedProps?: Omit<
    FeedProps,
    'endpoint' | 'widgets' | 'ItemComponent' | 'itemPropsGenerator' | 'itemIdGenerator' | 'ItemSkeleton' | 'ItemSkeletonProps' | 'FeedSidebarProps'
  >;

  /**
   * If true renders just the feed
   * @default false
   */
  showJustHome?: boolean;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: GroupInfoWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: GroupMembersWidget,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

/**
 * > API documentation for the Community-JS Group Feed Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific group's feed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/GroupFeed)

 #### Import

 ```jsx
 import {GroupFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoryFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function GroupFeed(inProps: GroupFeedProps): JSX.Element {
  // PROPS
  const props: GroupFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'group_feed',
    className,
    group,
    groupId,
    widgets = WIDGETS,
    FeedObjectProps = {},
    FeedSidebarProps = null,
    FeedProps = {},
    showJustHome = false
  } = props;

  // STATE
  const [tab, setTab] = useState<SCGroupFeedType>(SCGroupFeedType.HOME);

  const handleChange = (event: React.SyntheticEvent, newValue: SCGroupFeedType) => {
    setTab(newValue);
  };

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // REF
  const feedRef = useRef<FeedRef>();

  // Hooks
  const {scGroup} = useSCFetchGroup({id: groupId, group});

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    // Not insert if the group does not match
    if (feedObject.categories.findIndex((c) => c.id === scGroup.id) === -1) {
      enqueueSnackbar(<FormattedMessage id="ui.composerIconButton.composer.success" defaultMessage="ui.composerIconButton.composer.success" />, {
        action: (snackbarId: SnackbarKey) => (
          <Link to={scRoutingContext.url(SCRoutes[`${feedObject.type.toUpperCase()}_ROUTE_NAME`], ContributionUtils.getRouteData(feedObject))}>
            <FormattedMessage id="ui.composerIconButton.composer.viewContribute" defaultMessage="ui.composerIconButton.composer.viewContribute" />
          </Link>
        ),
        variant: 'success',
        autoHideDuration: 7000
      });
      return;
    }

    // Hydrate feedUnit
    const feedUnit = {
      type: feedObject.type,
      [feedObject.type]: feedObject,
      seen_by_id: [],
      has_boost: false
    };
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit, true);
  };

  // WIDGETS
  const _widgets = useMemo(
    () =>
      widgets.map((w) => {
        if (scGroup) {
          return {...w, componentProps: {...w.componentProps, groupId: scGroup.id}};
        }
        return w;
      }),
    [widgets, scGroup]
  );

  if (!scGroup) {
    return <GroupFeedSkeleton />;
  }

  return (
    <>
      {showJustHome ? (
        <Feed
          id={id}
          className={classes.root}
          ref={feedRef}
          endpoint={{
            ...Endpoints.CategoryFeed,
            url: () => Endpoints.CategoryFeed.url({id: scGroup.id})
          }}
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
          HeaderComponent={
            <InlineComposerWidget
              onSuccess={handleComposerSuccess}
              defaultValue={{categories: [scGroup]}}
              label={<FormattedMessage id="templates.groupFeed.composer.label" defaultMessage="templates.groupFeed.composer.label" />}
            />
          }
          CustomAdvProps={{position: SCCustomAdvPosition.POSITION_FEED, categoriesId: [scGroup.id]}}
          enabledCustomAdvPositions={[
            SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
            SCCustomAdvPosition.POSITION_FEED,
            SCCustomAdvPosition.POSITION_BELOW_TOPBAR
          ]}
          {...FeedProps}
        />
      ) : (
        <Root className={classNames(classes.root, className)}>
          <Tabs
            className={classes.tabs}
            value={tab}
            onChange={handleChange}
            variant="fullWidth"
            TabIndicatorProps={{children: <span className="MuiTabs-indicatorSpan" />}}>
            <TabRoot
              value={SCGroupFeedType.HOME}
              label={<FormattedMessage id="templates.groupFeed.tab.home.label" defaultMessage="templates.groupFeed.tab.home.label" />}
            />
            <TabRoot
              value={SCGroupFeedType.MEMBERS}
              label={<FormattedMessage id="templates.groupFeed.tab.members.label" defaultMessage="templates.groupFeed.tab.members.label" />}
            />
            <TabRoot
              value={SCGroupFeedType.MESSAGES}
              label={<FormattedMessage id="templates.groupFeed.tab.messages.label" defaultMessage="templates.groupFeed.tab.messages.label" />}
            />
          </Tabs>
          <Box className={classes.tabContent}>
            {tab === SCGroupFeedType.HOME && (
              <Feed
                id={id}
                className={classes.home}
                ref={feedRef}
                endpoint={{
                  ...Endpoints.CategoryFeed,
                  url: () => Endpoints.CategoryFeed.url({id: scGroup.id})
                }}
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
                HeaderComponent={
                  <InlineComposerWidget
                    onSuccess={handleComposerSuccess}
                    defaultValue={{categories: [scGroup]}}
                    label={<FormattedMessage id="templates.groupFeed.composer.label" defaultMessage="templates.groupFeed.composer.label" />}
                  />
                }
                CustomAdvProps={{position: SCCustomAdvPosition.POSITION_FEED, categoriesId: [scGroup.id]}}
                enabledCustomAdvPositions={[
                  SCCustomAdvPosition.POSITION_FEED_SIDEBAR,
                  SCCustomAdvPosition.POSITION_FEED,
                  SCCustomAdvPosition.POSITION_BELOW_TOPBAR
                ]}
                {...FeedProps}
              />
            )}
            {tab === SCGroupFeedType.MEMBERS && <></>}
            {tab === SCGroupFeedType.MESSAGES && <></>}
          </Box>
        </Root>
      )}
    </>
  );
}
