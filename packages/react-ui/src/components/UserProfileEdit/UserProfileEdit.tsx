import React from 'react';
import {styled} from '@mui/material/styles';
import {Accordion, AccordionDetails, AccordionProps as MUIAccordionProps, AccordionSummary, Box, Tab, Tabs, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {DEFAULT_FIELDS, DEFAULT_SETTINGS} from '../../constants/UserProfile';
import PublicInfo, {PublicInfoProps} from './Section/PublicInfo';
import Account, {AccountProps} from './Section/Account';
import Settings from './Section/Settings';
import classNames from 'classnames';
import {DistributiveOmit} from '@mui/types';
import {OverrideProps} from '@mui/material/OverridableComponent';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields, SCUserProfileSettings} from '../../types';

const PREFIX = 'SCUserProfileEdit';

const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  tabContent: `${PREFIX}-tab-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
  fields?: SCUserProfileFields[];
  /**
   * Settings to display in the profile
   * @default [notification, interaction, private_message]
   */
  settings?: SCUserProfileSettings[];
  /**
   * Props to apply to the accordion component
   * @default null
   */
  AccordionProps?: AccordionProps;

  /**
   * Props to apply to PublicInfo section
   * @default {}
   */
  UserProfileEditSectionPublicInfoProps?: Omit<PublicInfoProps, 'fields'>;

  /**
   * Props to apply to Settings section
   * @default {}
   */
  UserProfileEditSectionSettingsProps?: Omit<PublicInfoProps, 'settings'>;

  /**
   * Props to apply to Account section
   * @default {}
   */
  UserProfileEditSectionAccountProps?: AccountProps;

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
    settings = [...DEFAULT_SETTINGS],
    AccordionProps = {},
    UserProfileEditSectionPublicInfoProps = {},
    UserProfileEditSectionSettingsProps = {},
    UserProfileEditSectionAccountProps = {
      showCredentialsSection: true,
      showSocialAccountSection: true
    },
    ...rest
  } = props;

  // STATE
  const [tab, setTab] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // RENDER
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Tabs className={classes.tabs} value={tab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        <Tab label={<FormattedMessage id="ui.userProfileEdit.info" defaultMessage="ui.userProfileEdit.info" />} />
        <Tab label={<FormattedMessage id="ui.userProfileEdit.account" defaultMessage="ui.userProfileEdit.account" />} />
        <Tab label={<FormattedMessage id="ui.userProfileEdit.notification" defaultMessage="ui.userProfileEdit.notification" />} />
      </Tabs>
      <Box className={classes.tabContent}>
        {tab === 0 && <PublicInfo fields={fields} {...UserProfileEditSectionPublicInfoProps} />}
        {tab === 1 && <Account {...UserProfileEditSectionAccountProps} />}
        {tab === 2 && <Settings settings={settings} {...UserProfileEditSectionSettingsProps} />}
      </Box>
    </Root>
  );
}
