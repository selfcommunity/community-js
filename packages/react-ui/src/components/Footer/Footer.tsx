import React, {useEffect, useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Box, Button, Typography} from '@mui/material';
import classNames from 'classnames';
import {CustomMenuService} from '@selfcommunity/api-services';
import {SCCustomMenuItemType, SCCustomMenuType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {Link, SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FooterSkeleton from './Skeleton';

const PREFIX = 'SCFooter';

const classes = {
  root: `${PREFIX}-root`,
  itemList: `${PREFIX}-item-list`,
  item: `${PREFIX}-item`,
  copyright: `${PREFIX}-copyright`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface FooterProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Custom Menu object to render in the footer
   * @default null
   */
  menu?: SCCustomMenuType;

  /**
   * Actions to be inserted at the start
   * @default null
   */
  startActions?: React.ReactNode | null;

  /**
   * Actions to be inserted at the end
   * @default null
   */
  endActions?: React.ReactNode | null;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Footer component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the application footer, which contains the links to reach specific sections, and the application copyright.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Footer)

 #### Import
 ```jsx
 import {Footer} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCFooter` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFooter-root|Styles applied to the root element.|
 |link|.SCFooter-link-item|Styles applied to the link item element.|
 |copyright|.SCFooter-copyright|Styles applied to the copyright section.|

 * @param inProps
 */
export default function Footer(inProps: FooterProps): JSX.Element {
  // PROPS
  const props: FooterProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, menu = null, startActions = null, endActions = null, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const copyright = useMemo(() => {
    return scPreferences.preferences && SCPreferences.TEXT_APPLICATION_COPYRIGHT in scPreferences.preferences
      ? scPreferences.preferences[SCPreferences.TEXT_APPLICATION_COPYRIGHT].value.replace('$year', new Date().getFullYear())
      : null;
  }, [scPreferences.preferences]);

  // STATE
  const [_menu, setMenu] = useState<SCCustomMenuType>(menu);
  const [loading, setLoading] = useState<boolean>(!menu);

  /**
   * Fetches custom pages
   */
  function fetchMenu() {
    setLoading(true);
    CustomMenuService.getBaseCustomMenu()
      .then((menu: SCCustomMenuType) => {
        setMenu(menu);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      })
      .then(() => setLoading(false));
  }

  /**
   * On mount, fetches legal and custom pages
   */
  useEffect(() => {
    if (_menu) {
      return;
    }
    fetchMenu();
  }, []);

  /**
   * Renders root object
   */
  if (loading) {
    return <FooterSkeleton />;
  }
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      {startActions}
      <Box className={classes.itemList}>
        {_menu.items.map((item: SCCustomMenuItemType, index) => (
          <Button component={Link} key={item.id} className={classes.item} to={item.url} variant="text">
            {item.label}
          </Button>
        ))}
      </Box>
			{endActions}
      <Typography textAlign="center" className={classes.copyright} variant="body2" dangerouslySetInnerHTML={{__html: copyright}} />
    </Root>
  );
}
