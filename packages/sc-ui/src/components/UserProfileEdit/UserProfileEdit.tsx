import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Grid, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCUserFields, StringUtils} from '@selfcommunity/core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import PublicInfo from './Section/PublicInfo';
import Notification from './Section/Settings';
import classNames from 'classnames';

const messages = defineMessages({
  realName: {
    id: 'ui.userProfileEdit.realName',
    defaultMessage: 'ui.userProfileEdit.realName'
  },
  dateJoined: {
    id: 'ui.userProfileEdit.dateJoined',
    defaultMessage: 'ui.userProfileEdit.dateJoined'
  },
  bio: {
    id: 'ui.userProfileEdit.bio',
    defaultMessage: 'ui.userProfileEdit.bio'
  },
  location: {
    id: 'ui.userProfileEdit.location',
    defaultMessage: 'ui.userProfileEdit.location'
  },
  dateOfBirth: {
    id: 'ui.userProfileEdit.dateOfBirth',
    defaultMessage: 'ui.userProfileEdit.dateOfBirth'
  },
  description: {
    id: 'ui.userProfileEdit.description',
    defaultMessage: 'ui.userProfileEdit.description'
  },
  gender: {
    id: 'ui.userProfileEdit.gender',
    defaultMessage: 'ui.userProfileEdit.gender'
  },
  website: {
    id: 'ui.userProfileEdit.website',
    defaultMessage: 'ui.userProfileEdit.website'
  }
});

const PREFIX = 'SCUserProfileEdit';

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

export interface UserProfileEditProps {
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
   * User fields to display in the profile
   * @default [real_name, date_joined, date_of_birth, website, description, bio]
   */
  fields?: SCUserFields[];

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function UserProfileEdit(props: UserProfileEditProps): JSX.Element {
  // PROPS
  const {id = null, className = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // RENDER
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="ui.userProfileEdit.info" defaultMessage="ui.userProfileEdit.info" />
      </Typography>
      <PublicInfo fields={fields} />
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="ui.userProfileEdit.notification" defaultMessage="ui.userProfileEdit.notification" />
      </Typography>
      <Notification fields={fields} />
    </Root>
  );
}
