import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Button, ButtonBaseProps, Icon, Stack, useMediaQuery, useTheme} from '@mui/material';
import {SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils/src/utils/cache';
import {
  Link,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchGroup,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItemButton from '../../shared/BaseItemButton';
import {WidgetProps} from '../Widget';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import {PREFIX} from './constants';
import GroupSkeleton from './Skeleton';
import GroupSubscribeButton, {GroupSubscribeButtonProps} from '../GroupSubscribeButton';
import {formatCroppedName} from '../../utils/string';
import {GROUP_NAME_MAX_LENGTH_DESKTOP, GROUP_NAME_MAX_LENGTH_MOBILE} from '../../constants/Group';

const messages = defineMessages({
  groupMembers: {
    id: 'ui.group.members',
    defaultMessage: 'ui.group.members'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  icon: `${PREFIX}-icon`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: any) => ({}));

export interface GroupProps extends WidgetProps {
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
   * Props to spread to group subscribe/unsubscribe button
   * @default {}
   */
  groupSubscribeButtonProps?: GroupSubscribeButtonProps;
  /**
   * Badge content to show as group avatar badge if show reaction is true.
   */
  badgeContent?: any;
  /**
   * Prop to hide actions
   * @default false
   */
  hideActions?: boolean;
  /**
   * Prop to redirect the user to the group page
   * @default false
   */
  actionRedirect?: boolean;
  /**
   * Props to spread to the button
   * @default {}
   */
  buttonProps?: ButtonBaseProps;
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
 * > API documentation for the Community-JS Group component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a group item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Group)

 #### Import

 ```jsx
 import {group} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroup` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroup-root|Styles applied to the root element.|
 |avatar|.SCGroup-avatar|Styles applied to the avatar element.|
 |actions|.SCGroup-actions|Styles applied to the actions section.|
 |icon|.SCGroup-icon|Styles applied to the group privacy icon element.|


 *
 * @param inProps
 */
export default function Group(inProps: GroupProps): JSX.Element {
  // PROPS
  const props: GroupProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    groupId = null,
    group = null,
    className = null,
    elevation,
    hideActions = false,
    actionRedirect = false,
    groupSubscribeButtonProps = {},
    cacheStrategy,
    ...rest
  } = props;

  // STATE
  const {scGroup} = useSCFetchGroup({id: groupId, group, ...(cacheStrategy && {cacheStrategy})});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();

  // CONST
  const isGroupAdmin = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // HOOKS
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Render authenticated actions
   * @return {JSX.Element}
   */
  function renderAuthenticatedActions() {
    return (
      <Stack className={classes.actions} direction="row" alignItems="center" justifyContent="center" spacing={2}>
        {isGroupAdmin && <Icon>face</Icon>}
        {actionRedirect ? (
          <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, scGroup)}>
            {scGroup.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED ? (
              <FormattedMessage defaultMessage="ui.group.status.enter" id="ui.group.status.enter" />
            ) : (
              <FormattedMessage defaultMessage="ui.group.status.discover" id="ui.group.status.discover" />
            )}
          </Button>
        ) : (
          <GroupSubscribeButton group={group} groupId={groupId} {...groupSubscribeButtonProps} />
        )}
      </Stack>
    );
  }

  /**
   * Renders group object
   */
  if (!scGroup) {
    return <GroupSkeleton elevation={elevation} />;
  }

  /**
   * Renders root object
   */
  return (
    <>
      <Root
        elevation={elevation}
        {...rest}
        className={classNames(classes.root, className)}
        ButtonBaseProps={{component: Link, to: scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, scGroup)}}
        image={<Avatar alt={scGroup.name} src={scGroup.image_medium} className={classes.avatar} />}
        primary={
          <>
            {isMobile
              ? formatCroppedName(scGroup.name, GROUP_NAME_MAX_LENGTH_MOBILE)
              : formatCroppedName(scGroup.name, GROUP_NAME_MAX_LENGTH_DESKTOP)}{' '}
            <Icon className={classes.icon}>{group?.privacy === SCGroupPrivacyType.PRIVATE ? 'private' : 'public'}</Icon>
          </>
        }
        secondary={`${intl.formatMessage(messages.groupMembers, {total: scGroup.subscribers_counter})}`}
        actions={hideActions ? null : renderAuthenticatedActions()}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
