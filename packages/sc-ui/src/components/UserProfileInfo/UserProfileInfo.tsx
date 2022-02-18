import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {SCUserFields, SCUserType, StringUtils, useSCFetchUser} from '@selfcommunity/core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
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
/**
 *
 > API documentation for the Community-UI UserProfileInfo component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import UserProfileInfo from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUserProfileInfo` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileInfo-root|Styles applied to the root element.|
 |field|.SCUserProfileInfo-field|Styles applied to the field element.|

 * @param props
 */
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
