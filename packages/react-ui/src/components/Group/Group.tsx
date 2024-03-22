import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, ButtonBaseProps, Icon, Stack} from '@mui/material';
import {SCGroupType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchGroup, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, useIntl} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItemButton from '../../shared/BaseItemButton';
import {WidgetProps} from '../Widget';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import {PREFIX} from './constants';
import GroupSkeleton from './Skeleton';
import GroupSubscribeButton from '../GroupSubscribeButton';

const messages = defineMessages({
  groupMembers: {
    id: 'ui.group.members',
    defaultMessage: 'ui.group.members'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`
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
   * Handles actions ignore
   * @default null
   */
  handleIgnoreAction?: (u) => void;
  // /**
  //  * Props to spread to follow/friendship button
  //  * @default {}
  //  */
  // followConnectUserButtonProps?: FollowUserButtonProps | FriendshipButtonProps;
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
   * Props to spread to the button
   * @default {}
   */
  buttonProps?: ButtonBaseProps;
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
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/User)

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
    handleIgnoreAction,
    className = null,
    elevation,
    hideActions = false,
    buttonProps = {},
    visible = true,
    ...rest
  } = props;

  // STATE
  const {scGroup} = useSCFetchGroup({id: groupId, group});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  /**
   * Render authenticated actions
   * @return {JSX.Element}
   */
  function renderAuthenticatedActions() {
    return (
      <Stack className={classes.actions} direction="row" alignItems="center" justifyContent="center" spacing={2}>
        {/*{handleIgnoreAction && (*/}
        {/*  <Button size="small" onClick={handleIgnoreAction}>*/}
        {/*    <FormattedMessage defaultMessage="ui.group.ignore" id="ui.group.ignore" />*/}
        {/*  </Button>*/}
        {/*)}*/}
        <Icon>{!visible ? 'private' : 'public'}</Icon>
        <GroupSubscribeButton group={group} groupId={groupId} />
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
        ButtonBaseProps={buttonProps ?? {component: Link, to: scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, scGroup)}}
        image={<Avatar alt={scGroup.name} src={scGroup.image_medium} className={classes.avatar} />}
        primary={scGroup.name}
        secondary={`${intl.formatMessage(messages.groupMembers, {total: scGroup.subscribers_counter})}`}
        actions={hideActions ? null : renderAuthenticatedActions()}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
