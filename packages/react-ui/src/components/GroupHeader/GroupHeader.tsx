import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Icon, Paper, Typography} from '@mui/material';
import {SCGroupPrivacyType, SCGroupType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCFetchGroup, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
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
  membersCounter: `${PREFIX}-members-counter`
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
   * Props to spread to the group memebers button
   * @default {}
   */
  GroupMembersButtonProps?: GroupMembersButtonProps;

  /**
   *
   */
  actions?: React.ReactNode;
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
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserProfileHeader)

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
    GroupMembersButtonProps = {},
    actions,
    ...rest
  } = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scGroup, setSCGroup} = useSCFetchGroup({id: groupId, group});

  // CONST
  const canEdit = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  /**
   * Handles Change Avatar
   * @param avatar
   */
  function handleChangeAvatar(avatar) {
    if (canEdit) {
      setSCGroup(Object.assign({}, scGroup, {image_bigger: avatar}));
    }
  }

  /**
   * Handles Change Cover
   * @param cover
   */
  function handleChangeCover(cover) {
    if (canEdit) {
      setSCGroup(Object.assign({}, scGroup, {emotional_image: cover}));
    }
  }

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
            <img alt="group" src={scGroup.image_bigger ? scGroup.image_bigger : ''} />
          </Avatar>
        </Box>
        {canEdit && (
          <>
            <ChangeGroupPicture groupId={scGroup.id} onChange={handleChangeAvatar} className={classes.changePicture} {...ChangePictureProps} />
            <div className={classes.changeCover}>
              <ChangeGroupCover groupId={scGroup.id} onChange={handleChangeCover} {...ChangeCoverProps} />
            </div>
          </>
        )}
      </Paper>
      <Box className={classes.info}>
        {canEdit && <EditGroupButton group={scGroup} groupId={scGroup.id} onEditSuccess={(data: SCGroupType) => setSCGroup(data)} />}
        <Typography variant="h5" className={classes.name}>
          {scGroup.name}
        </Typography>
        <Box className={classes.visibility}>
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
          <Bullet />
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
        </Box>
        <Box className={classes.members}>
          <Typography className={classes.membersCounter} component="div">
            <FormattedMessage id="ui.groupHeader.members" defaultMessage="ui.groupHeader.members" values={{total: scGroup.subscribers_counter}} />
          </Typography>
          <GroupMembersButton groupId={scGroup?.id} group={scGroup} {...GroupMembersButtonProps} />
        </Box>
        {actions && actions}
      </Box>
    </Root>
  );
}
