import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {
  SCPreferencesContextType,
  SCUserContextType,
  SCUserFields,
  SCUserType,
  useSCFetchUser,
  useSCPreferences,
  useSCUser,
  StringUtils
} from '@selfcommunity/core';
import UserProfileInfoSkeleton from './Skeleton';
import classNames from 'classnames';

const messages = defineMessages({
  realName: {
    id: 'ui.userProfileInfo.realName',
    defaultMessage: 'ui.userProfileInfo.realName'
  },
  dateJoined: {
    id: 'ui.userProfileInfo.dateJoined',
    defaultMessage: 'ui.userProfileInfo.dateJoined'
  },
  bio: {
    id: 'ui.userProfileInfo.bio',
    defaultMessage: 'ui.userProfileInfo.bio'
  },
  location: {
    id: 'ui.userProfileInfo.location',
    defaultMessage: 'ui.userProfileInfo.location'
  },
  dateOfBirth: {
    id: 'ui.userProfileInfo.dateOfBirth',
    defaultMessage: 'ui.userProfileInfo.dateOfBirth'
  },
  description: {
    id: 'ui.userProfileInfo.description',
    defaultMessage: 'ui.userProfileInfo.description'
  },
  gender: {
    id: 'ui.userProfileInfo.gender',
    defaultMessage: 'ui.userProfileInfo.gender'
  },
  website: {
    id: 'ui.userProfileInfo.website',
    defaultMessage: 'ui.userProfileInfo.website'
  }
});

const PREFIX = 'SCUserProfileInfo';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: theme.spacing(2),
  [`& .${classes.field}`]: {
    fontWeight: 'bold'
  }
}));

const DEFAULT_FIELDS = [
  SCUserFields.REAL_NAME,
  SCUserFields.DATE_JOINED,
  SCUserFields.DATE_OF_BIRTH,
  SCUserFields.DESCRIPTION,
  SCUserFields.WEBSITE,
  SCUserFields.BIO
];

export interface UserProfileInfoProps {
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
   * User fields to display in the profile
   * @default [real_name, date_joined, date_of_birth, website, description, bio]
   */
  fields?: SCUserFields[];

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function UserProfileInfo(props: UserProfileInfoProps): JSX.Element {
  // PROPS
  const {className = null, userId = null, user = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // INTL
  const intl = useIntl();

  // RENDER
  const renderField = (user, field) => {
    switch (field) {
      case SCUserFields.DATE_JOINED:
      case SCUserFields.DATE_OF_BIRTH:
        return `${intl.formatDate(user[field], {year: 'numeric', month: 'numeric', day: 'numeric'})}`;
      default:
        return user[field];
    }
  };

  if (!scUser) {
    return <UserProfileInfoSkeleton />;
  }

  if (fields.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Grid container spacing={2}>
        {fields.map((field) => {
          if (scUser[field]) {
            return (
              <Grid item xs={6}>
                <Typography variant="body2">
                  <span className={classes.field}>{intl.formatMessage(messages[StringUtils.camelCase(field)])}:</span> {renderField(scUser, field)}
                </Typography>
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
    </Root>
  );
}
