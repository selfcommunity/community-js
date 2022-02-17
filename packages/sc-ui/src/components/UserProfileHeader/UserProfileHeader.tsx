import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Paper, Typography} from '@mui/material';
import ChangeCover, {ChangeCoverProps} from '../ChangeCover';
import ChangePicture, {ChangePictureProps} from '../ChangePicture';
import {useIntl} from 'react-intl';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  SCUserType,
  useSCFetchUser,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/core';
import UserProfileHeaderSkeleton from './Skeleton';
import classNames from 'classnames';

const PREFIX = 'SCUserProfileHeader';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  changePicture: `${PREFIX}-change-picture`,
  changeCover: `${PREFIX}-change-cover`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.cover}`]: {
    position: 'relative',
    minHeight: 350,
    background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)'
  },
  [`& .${classes.avatar}`]: {
    display: 'block',
    position: 'relative',
    margin: '0px auto',
    top: 190,
    width: 200,
    height: 200,
    borderRadius: 120,
    border: '#FFF solid 5px'
  },
  [`& .${classes.username}`]: {
    marginTop: 50
  },
  [`& .${classes.changePicture}`]: {
    position: 'relative',
    display: 'flex',
    margin: '0px auto',
    top: 110,
    left: 90
  },
  [`& .${classes.changeCover}`]: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    [theme.breakpoints.down('md')]: {
      bottom: 310
    }
  }
}));

export interface UserProfileHeaderProps {
  /**
   * Id of user object
   * @default null
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Props to spread change picture button
   * @default {}
   */
  ChangePictureProps?: ChangePictureProps;

  /**
   * Props to spread change cover button
   * @default {}
   */
  ChangeCoverProps?: ChangeCoverProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function UserProfileHeader(props: UserProfileHeaderProps): JSX.Element {
  // PROPS
  const {id = null, className = null, userId = null, user = null, ChangePictureProps = {}, ChangeCoverProps = {}, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // INTL
  const intl = useIntl();

  /**
   * Handles Change Avatar
   * Only if scUser.id === scUserContext.user.id
   * @param avatar
   */
  function handleChangeAvatar(avatar) {
    if (scUser.id === scUserContext.user.id) {
      setSCUser(Object.assign({}, scUser, {avatar: avatar.avatar}));
    }
  }

  /**
   * Handles Change Cover
   * Only if scUser.id === scUserContext.user.id
   * @param cover
   */
  function handleChangeCover(cover) {
    if (scUser.id === scUserContext.user.id) {
      setSCUser(Object.assign({}, scUser, {cover: cover}));
    }
  }

  // RENDER
  if (!scUser) {
    return <UserProfileHeaderSkeleton />;
  }
  const isMe = scUserContext.user && scUser.id === scUserContext.user.id;
  const _backgroundCover = {
    ...(scUser.cover
      ? {background: `url('${scUser.cover}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <img src={scUser.avatar ? scUser.avatar : ''} className={classes.avatar} />
        {isMe && (
          <>
            <ChangePicture iconButton={true} onChange={handleChangeAvatar} className={classes.changePicture} {...ChangePictureProps} />
            <div className={classes.changeCover}>
              <ChangeCover onChange={handleChangeCover} {...ChangeCoverProps} />
            </div>
          </>
        )}
      </Paper>
      <Typography variant="h5" align={'center'} className={classes.username}>
        {scUser.username}
      </Typography>
    </Root>
  );
}
