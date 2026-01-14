import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Avatar, Box, Icon, Paper, Typography, useMediaQuery, useTheme, styled} from '@mui/material';
import {
  SCContentType,
  SCEventPrivacyType,
  SCEventSubscriptionStatusType,
  SCGroupPrivacyType,
  SCGroupSubscriptionStatusType,
  SCGroupType
} from '@selfcommunity/types';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchGroup,
  useSCPaymentsEnabled,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import GroupHeaderSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import ChangeGroupCover, {ChangeGroupCoverProps} from '../ChangeGroupCover';
import {FormattedMessage} from 'react-intl';
import Bullet from '../../shared/Bullet';
import ChangeGroupPicture, {ChangeGroupPictureProps} from '../ChangeGroupPicture';
import GroupMembersButton, {GroupMembersButtonProps} from '../GroupMembersButton';
import EditGroupButton from '../EditGroupButton';
import GroupSubscribeButton, {GroupSubscribeButtonProps} from '../GroupSubscribeButton';
import GroupInviteButton from '../GroupInviteButton';
import {SCGroupEventType, SCGroupMembersEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';
import GroupActionsMenu, {GroupActionsMenuProps} from '../GroupActionsMenu';
import BuyButton from '../BuyButton';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  avatar: `${PREFIX}-avatar`,
  info: `${PREFIX}-info`,
  name: `${PREFIX}-name`,
  changePicture: `${PREFIX}-change-picture`,
  changeCover: `${PREFIX}-change-cover`,
  visibility: `${PREFIX}-visibility`,
  visibilityItem: `${PREFIX}-visibility-item`,
  members: `${PREFIX}-members`,
  membersCounter: `${PREFIX}-members-counter`,
  multiActions: `${PREFIX}-multi-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface GroupHeaderProps {
  /**
   * Id of group object
   * @default null
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
   * Id of the group
   * @default null
   */
  groupId?: number;
  /**
   * Props to spread change picture button
   * @default {}
   */
  ChangePictureProps?: ChangeGroupPictureProps;

  /**
   * Props to spread change cover button
   * @default {}
   */
  ChangeCoverProps?: ChangeGroupCoverProps;
  /**
   * Props to spread group button followed
   * @default {}
   */
  GroupSubscribeButtonProps?: GroupSubscribeButtonProps;
  /**
   * Props to spread to the group memebers button
   * @default {}
   */
  GroupMembersButtonProps?: GroupMembersButtonProps;
  /**
   * Props to spread event actions menu
   * @default {}
   */
  GroupActionsProps?: Omit<GroupActionsMenuProps, 'group'>;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Group Header component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the groups top section.

 #### Import

 ```jsx
 import {UserProfileHeader} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupHeader-root|Styles applied to the root element.|
 |cover|.SCGroupHeader-cover|Styles applied to the cover element.|
 |avatar|.SCGroupHeader-avatar|Styles applied to the avatar element.|
 |info|SCGroupHeader-info|Styles applied to the info section.|
 |name|SCGroupHeader-username|Styles applied to the username element.|
 |changePicture|.SCGroupHeader-change-picture|Styles applied to changePicture element.|
 |changeCover|.SCGroupHeader-change-cover`|Styles applied to changeCover element.|

 * @param inProps
 */
export default function GroupHeader(inProps: GroupHeaderProps): JSX.Element {
  // PROPS
  const props: GroupHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = null,
    className = null,
    group,
    groupId = null,
    ChangePictureProps = {},
    ChangeCoverProps = {},
    GroupSubscribeButtonProps = {},
    GroupMembersButtonProps = {},
    GroupActionsProps,
    ...rest
  } = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const visibilityEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_GROUPS_VISIBILITY_ENABLED].value,
    [scPreferences.preferences]
  );
  const privateEnabled = useMemo(
    () => scPreferences.preferences[SCPreferences.CONFIGURATIONS_GROUPS_PRIVATE_ENABLED].value,
    [scPreferences.preferences]
  );

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scGroup, setSCGroup} = useSCFetchGroup({id: groupId, group});
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // PAYMENTS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  // REFS
  const updatesSubscription = useRef(null);

  // CONST
  const isGroupAdmin = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  /**
   * Handles Change Avatar
   * @param avatar
   */
  function handleChangeAvatar(avatar: any) {
    if (isGroupAdmin) {
      setSCGroup(Object.assign({}, scGroup, {image_big: avatar}));
    }
  }

  /**
   * Handles Change Cover
   * @param cover
   */
  function handleChangeCover(cover: any) {
    if (isGroupAdmin) {
      setSCGroup(Object.assign({}, scGroup, {emotional_image: cover}));
    }
  }

  /**
   * Handles callback subscribe/unsubscribe group
   */
  const handleSubscribe = (group, status) => {
    setSCGroup({...group, subscribers_counter: group.subscribers_counter + (status ? 1 : -1)});
  };

  /**
   * Subscriber for pubsub callback
   */
  const onChangeGroupMembersHandler = useCallback(
    (msg: string, data: SCGroupMembersEventType) => {
      if (data && data?.group?.id === scGroup?.id) {
        let _group = {...scGroup};
        if (msg === `${SCTopicType.GROUP}.${SCGroupEventType.ADD_MEMBER}`) {
          _group.subscribers_counter = _group.subscribers_counter + 1;
        } else if (msg === `${SCTopicType.GROUP}.${SCGroupEventType.REMOVE_MEMBER}`) {
          _group.subscribers_counter = Math.max(_group.subscribers_counter - 1, 0);
        }
        setSCGroup(_group);
      }
    },
    [scGroup, setSCGroup]
  );

  /**
   * On mount, subscribe to receive groups updates (only edit)
   */
  useEffect(() => {
    if (scGroup) {
      updatesSubscription.current = PubSub.subscribe(`${SCTopicType.GROUP}.${SCGroupEventType.MEMBERS}`, onChangeGroupMembersHandler);
    }
    return () => {
      updatesSubscription.current && PubSub.unsubscribe(updatesSubscription.current);
    };
  }, [scGroup]);

  // RENDER
  if (!scGroup) {
    return <GroupHeaderSkeleton />;
  }
  const _backgroundCover = {
    ...(scGroup.emotional_image
      ? {background: `url('${scGroup.emotional_image}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <Box className={classes.avatar}>
          <Avatar>
            <img alt="group" src={scGroup.image_big ? scGroup.image_big : ''} />
          </Avatar>
        </Box>
        {isGroupAdmin && (
          <>
            <ChangeGroupPicture groupId={scGroup.id} onChange={handleChangeAvatar} className={classes.changePicture} {...ChangePictureProps} />
            <div className={classes.changeCover}>
              <ChangeGroupCover groupId={scGroup.id} onChange={handleChangeCover} {...ChangeCoverProps} />
            </div>
          </>
        )}
      </Paper>
      <Box className={classes.info}>
        {isGroupAdmin && !isMobile && (
          <Box className={classes.multiActions}>
            <EditGroupButton group={scGroup} groupId={scGroup.id} onEditSuccess={(data: SCGroupType) => setSCGroup(data)} />
            <GroupActionsMenu group={scGroup} onEditSuccess={(data: SCGroupType) => setSCGroup(data)} {...GroupActionsProps} />
          </Box>
        )}
        <Typography variant="h5" className={classes.name}>
          {scGroup.name}
        </Typography>
        {privateEnabled && (
          <Box className={classes.visibility}>
            {privateEnabled && (
              <>
                {scGroup.privacy === SCGroupPrivacyType.PUBLIC ? (
                  <Typography className={classes.visibilityItem}>
                    <Icon>public</Icon>
                    <FormattedMessage id="ui.groupHeader.visibility.public" defaultMessage="ui.groupHeader.visibility.public" />
                  </Typography>
                ) : (
                  <Typography className={classes.visibilityItem}>
                    <Icon>private</Icon>
                    <FormattedMessage id="ui.groupHeader.visibility.private" defaultMessage="ui.groupHeader.visibility.private" />
                  </Typography>
                )}
              </>
            )}
            {visibilityEnabled && (
              <>
                {privateEnabled && <Bullet />}
                {scGroup.visible ? (
                  <Typography className={classes.visibilityItem}>
                    <Icon>visibility</Icon>
                    <FormattedMessage id="ui.groupHeader.visibility.visible" defaultMessage="ui.groupHeader.visibility.visible" />
                  </Typography>
                ) : (
                  <Typography className={classes.visibilityItem}>
                    <Icon>visibility_off</Icon>
                    <FormattedMessage id="ui.groupHeader.visibility.hidden" defaultMessage="ui.groupHeader.visibility.hidden" />
                  </Typography>
                )}
              </>
            )}
            {isPaymentsEnabled &&
              scGroup.paywalls?.length > 0 &&
              (scGroup.privacy === SCGroupPrivacyType.PUBLIC ||
                (scGroup.privacy === SCGroupPrivacyType.PRIVATE &&
                  scGroup.subscription_status &&
                  scGroup.subscription_status !== SCGroupSubscriptionStatusType.REQUESTED)) && (
                <BuyButton
                  size="md"
                  variant="text"
                  startIcon={<Icon>dredit-card</Icon>}
                  contentType={SCContentType.GROUP}
                  content={scGroup}
                  label={<FormattedMessage id="ui.groupHeader.paid" defaultMessage="ui.groupHeader.paid" />}
                />
              )}
          </Box>
        )}
        <>
          {((scGroup && scGroup.privacy === SCGroupPrivacyType.PUBLIC) ||
            scGroup.subscription_status === SCGroupSubscriptionStatusType.SUBSCRIBED ||
            isGroupAdmin) && (
            <Box className={classes.members}>
              <Typography className={classes.membersCounter} component="div">
                <FormattedMessage id="ui.groupHeader.members" defaultMessage="ui.groupHeader.members" values={{total: scGroup.subscribers_counter}} />
              </Typography>
              <GroupMembersButton
                key={scGroup.subscribers_counter}
                groupId={scGroup?.id}
                group={scGroup}
                autoHide={!isGroupAdmin}
                {...GroupMembersButtonProps}
              />
            </Box>
          )}
        </>
        {isGroupAdmin ? (
          <Box>
            <GroupInviteButton group={scGroup} groupId={scGroup.id} />
            {isMobile && <GroupActionsMenu group={scGroup} onEditSuccess={(data: SCGroupType) => setSCGroup(data)} {...GroupActionsProps} />}
          </Box>
        ) : (
          <GroupSubscribeButton group={scGroup} onSubscribe={handleSubscribe} {...GroupSubscribeButtonProps} />
        )}
      </Box>
    </Root>
  );
}
