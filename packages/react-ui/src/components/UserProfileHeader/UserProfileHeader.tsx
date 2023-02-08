import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Paper, Typography} from '@mui/material';
import ChangeCover, {ChangeCoverProps} from '../ChangeCover';
import ChangePicture, {ChangePictureProps} from '../ChangePicture';
import {SCUserType} from '@selfcommunity/types';
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
import UserProfileHeaderSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

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
    marginTop: 50,
    textAlign: 'center'
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

/**
 * > API documentation for the Community-JS User Profile AppBar component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileHeader} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileHeader-root|Styles applied to the root element.|
 |cover|.SCUserProfileHeader-cover|Styles applied to the cover element.|
 |avatar|.SCUserProfileHeader-avatar|Styles applied to the avatar element.|
 |info|SCUserProfileHeader-info|Styles applied to the info element.|
 |username|SCUserProfileHeader-username|Styles applied to the username element.|
 |changePicture|.SCUserProfileHeader-change-picture|Styles applied to changePicture element.|
 |changeCover|.SCUserProfileHeader-change-cover`|Styles applied to changeCover element.|

 * @param inProps
 */
export default function UserProfileHeader(inProps: UserProfileHeaderProps): JSX.Element {
  // PROPS
  const props: UserProfileHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, userId = null, user = null, ChangePictureProps = {}, ChangeCoverProps = {}, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  /**
   * Handles Change Avatar
   * Only if scUser.id === scUserContext.user.id
   * If avatar === null reset the avatar with auto-generated image
   * @param avatar
   */
  function handleChangeAvatar(avatar) {
    if (scUser.id === scUserContext.user.id && avatar) {
      setSCUser(Object.assign({}, scUser, {avatar: avatar.avatar}));
    } else {
      setSCUser(Object.assign({}, scUser, {avatar: `${scContext.settings.portal}/avatar/${scUser.username}`}));
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
      <Typography variant="h5" className={classes.username}>
        {scUser.username}
      </Typography>
    </Root>
  );
}
