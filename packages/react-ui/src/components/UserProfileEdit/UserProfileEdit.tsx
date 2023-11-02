import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Tab, Tabs} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {DEFAULT_FIELDS, DEFAULT_SETTINGS} from '../../constants/UserProfile';
import PublicInfo, {PublicInfoProps} from './Section/PublicInfo';
import Account, {AccountProps} from './Section/Account';
import Settings from './Section/Settings';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCUserProfileFields, SCUserProfileSettings} from '../../types';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  tabContent: `${PREFIX}-tab-content`,
  publicInfo: `${PREFIX}-public-info`,
  account: `${PREFIX}-account`,
  settings: `${PREFIX}-settings`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
 * > API documentation for the Community-JS User Profile Edit component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a section composed of different tabs where the user can edit the settings about its public information, account and notifications.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserProfileEdit)

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
 |tabs|.SCUserProfileEdit-tabs|Styles applied to the tab elements.|
 |tabsContent|.SCUserProfileEdit-tabs-content|Styles applied to tab content elements.|

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
    UserProfileEditSectionPublicInfoProps = {},
    UserProfileEditSectionAccountProps = {
      showCredentialsSection: true,
      showSocialAccountSection: true
    },
    UserProfileEditSectionSettingsProps = {},
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
      <Tabs className={classes.tabs} value={tab} onChange={handleChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
        <Tab label={<FormattedMessage id="ui.userProfileEdit.info" defaultMessage="ui.userProfileEdit.info" />} />
        <Tab label={<FormattedMessage id="ui.userProfileEdit.account" defaultMessage="ui.userProfileEdit.account" />} />
        <Tab label={<FormattedMessage id="ui.userProfileEdit.notification" defaultMessage="ui.userProfileEdit.notification" />} />
      </Tabs>
      <Box className={classes.tabContent}>
        {tab === 0 && <PublicInfo className={classes.publicInfo} fields={fields} {...UserProfileEditSectionPublicInfoProps} />}
        {tab === 1 && <Account className={classes.account} {...UserProfileEditSectionAccountProps} />}
        {tab === 2 && <Settings settings={settings} className={classes.settings} {...UserProfileEditSectionSettingsProps} />}
      </Box>
    </Root>
  );
}
