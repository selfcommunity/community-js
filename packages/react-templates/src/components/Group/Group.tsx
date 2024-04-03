import React, {ReactNode} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, GroupHeader, SCFeedWidgetType} from '@selfcommunity/react-ui';
import {useSCFetchGroup} from '@selfcommunity/react-core';
import {SCGroupType} from '@selfcommunity/types';
import GroupSkeletonTemplate from './Skeleton';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from './constants';
import GroupFeed, {GroupFeedProps} from '../GroupFeed';

const classes = {
  root: `${PREFIX}-root`,
  feed: `${PREFIX}-feed`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupProps {
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
   * Props to spread to GroupFeed component
   * @default {}
   */
  GroupFeedProps?: GroupFeedProps;
}
/**
 * > API documentation for the Community-JS Category Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific group's template.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/Category)

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
export default function Group(inProps: GroupProps): JSX.Element {
  // PROPS
  const props: GroupProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'group', className, group, groupId, widgets, FeedObjectProps, FeedSidebarProps, GroupFeedProps = {}} = props;

  // HOOKS
  const {scGroup, setSCGroup} = useSCFetchGroup({id: groupId, group});

  const handleSubscribe = (group, status) => {
    setSCGroup(Object.assign({}, scGroup, {subscription_status: status}));
  };

  if (!scGroup) {
    return <GroupSkeletonTemplate />;
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <GroupHeader groupId={scGroup.id} GroupSubscribeButtonProps={{onSubscribe: handleSubscribe}} />
      <GroupFeed
        className={classes.feed}
        group={scGroup}
        widgets={widgets}
        FeedObjectProps={FeedObjectProps}
        FeedSidebarProps={FeedSidebarProps}
        {...GroupFeedProps}
      />
    </Root>
  );
}
