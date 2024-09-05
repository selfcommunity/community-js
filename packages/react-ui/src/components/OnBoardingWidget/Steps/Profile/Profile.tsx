import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import {Button, Dialog, DialogActions, DialogProps, IconButton, Paper, Slide, Typography} from '@mui/material';
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
import {SCOnBoardingStepStatusType, SCStepType, SCUserType} from '@selfcommunity/types';
import {DEFAULT_FIELDS} from '../../../../constants/UserProfile';
import {SCUserProfileFields} from '../../../../types/user';
import {TransitionProps} from '@mui/material/transitions';
import Icon from '@mui/material/Icon';
import BaseDialog from '../../../../shared/BaseDialog';

const classes = {
  root: `${PREFIX}-profile-root`,
  title: `${PREFIX}-profile-title`,
  header: `${PREFIX}-profile-header`,
  cover: `${PREFIX}-profile-cover`,
  avatar: `${PREFIX}-profile-avatar`,
  changePicture: `${PREFIX}-profile-change-picture`,
  changeCover: `${PREFIX}-profile-change-cover`,
  publicInfo: `${PREFIX}-profile-public-info`
};

export interface ProfileProps {
  /**
   * The content step
   */
  step: SCStepType;
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
  onCompleteAction: (id: number) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ProfileRoot'
})(() => ({}));

const DialogRoot = styled(Dialog, {
  name: PREFIX,
  slot: 'ProfileDialogRoot'
})(() => ({}));

export default function Profile(inProps: ProfileProps) {
  // PROPS
  const props: ProfileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, fields = [...DEFAULT_FIELDS], user = null, step, onCompleteAction, ...rest} = props;
  // STATE
  const [open, setOpen] = useState(false);

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scUser, setSCUser} = useSCFetchUser({id: scUserContext?.user?.id, user});
  const hasBadge = scUser && scUser.community_badge;

  // HANDLERS
  const handleCompleteAction = () => {
    if (step?.status !== SCOnBoardingStepStatusType.COMPLETED && step?.status !== SCOnBoardingStepStatusType.IN_PROGRESS) {
      onCompleteAction(step.id);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    handleCompleteAction();
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
    handleCompleteAction();
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography variant="h4" className={classes.title} alignSelf="self-start">
        <FormattedMessage id="ui.onBoardingWidget.profile" defaultMessage="ui.onBoardingWidget.profile" />
      </Typography>
      <Typography>
        <FormattedMessage id="ui.onBoardingWidget.step.profile.summary" defaultMessage="ui.onBoardingWidget.step.profile.summary" />
      </Typography>
      <Button variant="outlined" size="small" color="primary" onClick={handleClickOpen}>
        <FormattedMessage id="ui.onBoardingWidget.step.profile.button" defaultMessage="ui.onBoardingWidget.step.profile.button" />
      </Button>
      <DialogRoot fullScreen {...rest} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogActions>
          <IconButton onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </DialogActions>
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
          <PublicInfo fields={fields} onEditSuccess={handleCompleteAction} />
        </Box>
      </DialogRoot>
    </Root>
  );
}
