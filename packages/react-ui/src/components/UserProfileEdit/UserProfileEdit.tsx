import React from 'react';
import {styled} from '@mui/material/styles';
import {Accordion, AccordionDetails, AccordionProps as MUIAccordionProps, AccordionSummary, Box, Typography} from '@mui/material';
import {defineMessages, FormattedMessage} from 'react-intl';
import {SCUserFields} from '@selfcommunity/types';
import {DEFAULT_FIELDS} from '../../constants/UserProfile';
import PublicInfo, {PublicInfoProps} from './Section/PublicInfo';
import Settings, {SettingsProps} from './Section/Settings';
import classNames from 'classnames';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {useThemeProps} from '@mui/system';

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
  [`& .${classes.field}`]: {
    fontWeight: 'bold'
  }
}));

interface AccordionTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & DistributiveOmit<MUIAccordionProps, 'children'> & {};
  defaultComponent: D;
}

type AccordionProps<D extends React.ElementType = AccordionTypeMap['defaultComponent'], P = {}> = OverrideProps<AccordionTypeMap<P, D>, D>;

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
   * Props to apply to the accordion component
   * @default null
   */
  AccordionProps?: AccordionProps;

  /**
   * Props to apply to PublicInfo section
   * @default {}
   */
  UserProfileEditSectionPublicInfoProps?: PublicInfoProps;

  /**
   * Props to apply to Settings section
   * @default {}
   */
  UserProfileEditSectionSettingsProps?: SettingsProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS User Profile Edit component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileEdit} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileEdit` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileEdit-root|Styles applied to the root element.|
 |field|.SCUserProfileEdit-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserProfileEdit(inProps: UserProfileEditProps): JSX.Element {
  // PROPS
  const props: UserProfileEditProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = null,
    className = null,
    fields = [...DEFAULT_FIELDS],
    AccordionProps = {},
    UserProfileEditSectionPublicInfoProps = {},
    UserProfileEditSectionSettingsProps = {},
    ...rest
  } = props;

  // RENDER
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Accordion defaultExpanded {...AccordionProps}>
        <AccordionSummary aria-controls="profile information">
          <Typography variant="body1">
            <FormattedMessage id="ui.userProfileEdit.info" defaultMessage="ui.userProfileEdit.info" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PublicInfo fields={fields} {...UserProfileEditSectionPublicInfoProps}/>
        </AccordionDetails>
      </Accordion>
      <Accordion {...AccordionProps}>
        <AccordionSummary aria-controls="profile settings">
          <Typography variant="body1">
            <FormattedMessage id="ui.userProfileEdit.notification" defaultMessage="ui.userProfileEdit.notification" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Settings {...UserProfileEditSectionSettingsProps} />
        </AccordionDetails>
      </Accordion>
    </Root>
  );
}
