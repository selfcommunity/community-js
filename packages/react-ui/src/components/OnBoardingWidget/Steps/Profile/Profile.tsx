import React, {useCallback, useState} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import {Button, Drawer, IconButton, Paper, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import PublicInfo from '../../../UserProfileEdit/Section/PublicInfo';
import {
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCContext,
  useSCFetchUser,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import UserAvatar from '../../../../shared/UserAvatar';
import ChangePicture from '../../../ChangePicture';
import ChangeCover from '../../../ChangeCover';
import {SCUserType} from '@selfcommunity/types';
import {DEFAULT_FIELDS} from '../../../../constants/UserProfile';
import {SCUserProfileFields} from '../../../../types/user';
import Icon from '@mui/material/Icon';

const classes = {
  root: `${PREFIX}-profile-root`,
  title: `${PREFIX}-profile-title`,
  icon: `${PREFIX}-profile-icon`,
  cover: `${PREFIX}-profile-cover`,
  avatar: `${PREFIX}-profile-avatar`,
  changePicture: `${PREFIX}-profile-change-picture`,
  changeCover: `${PREFIX}-profile-change-cover`,
  publicInfo: `${PREFIX}-profile-public-info`
};

export interface ProfileProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * User fields to display in the profile
   * @default [real_name, date_joined, date_of_birth, website, description, bio]
   */
  fields?: SCUserProfileFields[];
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Callback triggered on complete action click
   * @default null
   */
  onCompleteAction: () => void;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ProfileRoot'
})(() => ({}));

const DrawerRoot = styled(Drawer, {
  name: PREFIX,
  slot: 'ProfileDrawerRoot'
})(() => ({}));

export default function Profile(inProps: ProfileProps) {
  // PROPS
  const props: ProfileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, fields = [...DEFAULT_FIELDS], user = null, onCompleteAction, ...rest} = props;
  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scUser, setSCUser} = useSCFetchUser({id: scUserContext?.user?.id, user});
  const hasBadge = scUser && scUser.community_badge;

  // HANDLERS

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  /**
   * Handles Change Avatar
   * If avatar === null reset the avatar with auto-generated image
   * @param avatar
   */
  function handleChangeAvatar(avatar) {
    if (avatar) {
      setSCUser(Object.assign({}, scUser, {avatar: avatar.avatar}));
    } else {
      setSCUser(Object.assign({}, scUser, {avatar: `${scContext.settings.portal}/api/v2/avatar/${scUser.id}`}));
    }
    onCompleteAction();
  }

  const _backgroundCover = {
    ...(scUser?.cover
      ? {background: `url('${scUser.cover}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };

  /**
   * Handles Change Cover
   * Only if scUser.id === scUserContext.user.id
   * @param cover
   */
  function handleChangeCover(cover) {
    setSCUser(Object.assign({}, scUser, {cover: cover}));
    onCompleteAction();
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography variant="h4" className={classes.title} alignSelf="self-start">
        <FormattedMessage id="ui.onBoardingWidget.profile" defaultMessage="ui.onBoardingWidget.profile" />
      </Typography>
      <Typography alignSelf="self-start">
        <FormattedMessage id="ui.onBoardingWidget.step.profile.summary" defaultMessage="ui.onBoardingWidget.step.profile.summary" />
      </Typography>
      <Button variant="outlined" size="small" color="primary" onClick={handleOpen}>
        <FormattedMessage id="ui.onBoardingWidget.step.profile.button" defaultMessage="ui.onBoardingWidget.step.profile.button" />
      </Button>
      <DrawerRoot anchor="right" open={Boolean(anchorEl)} onClose={handleClose}>
        <IconButton className={classes.icon} onClick={handleClose}>
          <Icon>close</Icon>
        </IconButton>
        <Paper style={_backgroundCover} classes={{root: classes.cover}}>
          <Box className={classes.avatar}>
            <UserAvatar hide={!hasBadge}>
              <img src={scUser?.avatar ? scUser.avatar : ''} />
            </UserAvatar>
          </Box>
          <>
            <ChangePicture iconButton={true} onChange={handleChangeAvatar} className={classes.changePicture} />
            <div className={classes.changeCover}>
              <ChangeCover onChange={handleChangeCover} />
            </div>
          </>
        </Paper>
        <Box className={classes.publicInfo}>
          <PublicInfo fields={fields} onEditSuccess={onCompleteAction} />
        </Box>
      </DrawerRoot>
    </Root>
  );
}
