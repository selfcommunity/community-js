import React, {useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Endpoints} from '@selfcommunity/api-services';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {Feed, FeedProps, FeedRef, FeedSidebarProps, User, UserSkeleton} from '@selfcommunity/react-ui';
import {UserConnectionsSkeleton} from './index';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCUUserConnectionsTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface UserConnectionsProps {
  /**
   * Id of the feed object
   * @default 'user_feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

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

/**
 * > API documentation for the Community-JS User Feed Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function UserConnections(inProps: UserConnectionsProps): JSX.Element {
  // PROPS
  const props: UserConnectionsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'user_connections', className, FeedSidebarProps = null, FeedProps = {}} = props;

  // Context
  const scUserContext: SCUserContextType = useSCUser();

  // REF
  const feedRef = useRef<FeedRef>();

  if (!scUserContext.user) {
    return <UserConnectionsSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={feedRef}
      endpoint={{
        ...Endpoints.UserConnections,
        url: () => Endpoints.UserConnections.url({id: scUserContext.user.id})
      }}
      widgets={[]}
      ItemComponent={User}
      itemPropsGenerator={(scUser, item) => ({user: item})}
      itemIdGenerator={(item: any) => item.id}
      ItemProps={{showFollowers: false}}
      ItemSkeleton={UserSkeleton}
      FeedSidebarProps={FeedSidebarProps}
      {...FeedProps}
    />
  );
}
