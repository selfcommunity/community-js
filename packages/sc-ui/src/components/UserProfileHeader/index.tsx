import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider, Grid, Paper, Typography} from '@mui/material';
import ChangeCover from '../ChangeCover';
import ChangePicture from '../ChangePicture';
import {FormattedMessage, useIntl} from 'react-intl';
import {
  SCPreferences,
  SCPreferencesContextType,
  useSCPreferences,
  SCUserContextType,
  SCUserType,
  useSCFetchUser,
  useSCUser
} from '@selfcommunity/core';

const PREFIX = 'SCUserProfileHeader';

const classes = {
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
  userId?: number;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function UserProfileHeader(props: UserProfileHeaderProps): JSX.Element {
  // PROPS
  const {className = null, userId = null, user = null, ...rest} = props;

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

  /**
   * Renders root object
   */
  if (scUser) {
    const _backgroundCover = {
      ...(scUser.cover
        ? {background: `url('${scUser.cover}') center / cover`}
        : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
    };
    return (
      <Root className={className} {...rest}>
        <Paper style={_backgroundCover} classes={{root: classes.cover}}>
          <img src={scUser.avatar ? scUser.avatar : ''} className={classes.avatar} />
          {scUserContext.user && scUser.id === scUserContext.user.id && (
            <>
              <ChangePicture iconButton={true} onChange={handleChangeAvatar} className={classes.changePicture} />
              <div className={classes.changeCover}>
                <ChangeCover onChange={handleChangeCover} />
              </div>
            </>
          )}
        </Paper>
        <Typography variant="h5" align={'center'} className={classes.username}>
          {scUser.username}
        </Typography>
        <Grid container spacing={2} sx={{mt: 0.5, p: 3}}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <b>
                <FormattedMessage id="ui.userProfileHeader.realName" defaultMessage="ui.userProfileHeader.realName" />:
              </b>{' '}
              {scUser.real_name ? scUser.real_name : ' - '}
            </Typography>
            <Typography variant="body2">
              <b>
                <FormattedMessage id="ui.userProfileHeader.dateOfBirth" defaultMessage="ui.userProfileHeader.dateOfBirth" />
              </b>{' '}
              {scUser.date_of_birth ? `${intl.formatDate(scUser.date_of_birth, {year: 'numeric', month: 'numeric', day: 'numeric'})}` : ' - '}
            </Typography>
            <Typography variant="body2">
              <b>
                <FormattedMessage id="ui.userProfileHeader.job" defaultMessage="ui.userProfileHeader.job" />:
              </b>{' '}
              {scUser.description ? scUser.description : ' - '}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <b>
                <FormattedMessage id="ui.userProfileHeader.dateJoined" defaultMessage="ui.userProfileHeader.dateJoined" />:
              </b>{' '}
              {scUser.date_joined ? `${intl.formatDate(scUser.date_joined, {year: 'numeric', month: 'numeric', day: 'numeric'})}` : ' - '}
            </Typography>
            <Typography variant="body2">
              <b>
                <FormattedMessage id="ui.userProfileHeader.website" defaultMessage="ui.userProfileHeader.website" />:
              </b>{' '}
              {scUser.website ? scUser.website : ' - '}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
      </Root>
    );
  }
  return null;
}
