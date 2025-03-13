import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {useIntl} from 'react-intl';
import {Logger} from '@selfcommunity/utils';
import {SCUserType} from '@selfcommunity/types';
import {SCPreferences, SCPreferencesContextType, useSCFetchUser, useSCPreferences} from '@selfcommunity/react-core';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import UserInfoSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields} from '../../types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import Tags, {TagsComponentType} from '../../shared/Tags';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserPaymentMethodsProps {
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
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Payment Methods. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPaymentMethods} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethods` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethods-root|Styles applied to the root element.|
 |field|.SCUserPaymentMethods-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserPaymentMethods(inProps: UserPaymentMethodsProps): JSX.Element {
  // PROPS
  const props: UserPaymentMethodsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, fields = [...DEFAULT_FIELDS], ...rest} = props;

  // STATE
  const {scUser} = useSCFetchUser({id: userId, user});

  // INTL
  const intl = useIntl();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const metadataDefinitions = useMemo(() => {
    if (scPreferences.preferences && SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS in scPreferences.preferences) {
      try {
        return JSON.parse(scPreferences.preferences[SCPreferences.CONFIGURATIONS_USER_METADATA_DEFINITIONS].value);
      } catch (e) {
        Logger.error(SCOPE_SC_UI, 'Error on parse user metadata.');
        return {};
      }
    }
    return null;
  }, [scPreferences.preferences]);

  // FIELDS
  const _fields: string[] = [...fields, ...Object.keys(metadataDefinitions)];

  // RENDER
  const renderField = (user, field) => {
    switch (field) {
      case SCUserProfileFields.DATE_JOINED:
      case SCUserProfileFields.DATE_OF_BIRTH:
        return `${intl.formatDate(user[field], {year: 'numeric', month: 'numeric', day: 'numeric'})}`;
      case SCUserProfileFields.TAGS:
        return (
          <Tags
            tags={user.tags.filter((t) => t.visible)}
            type={TagsComponentType.LIST}
            direction={'row'}
            TagChipProps={{clickable: false, disposable: false}}
          />
        );
      case SCUserProfileFields.WEBSITE:
        return (
          <a href={user[field]} target={'_blank'}>
            {user[field]}
          </a>
        );
      default:
        return user[field];
    }
  };

  if (!scUser || !metadataDefinitions) {
    return <UserInfoSkeleton />;
  }

  if (_fields.length === 0) {
    return null;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
    </Root>
  );
}
