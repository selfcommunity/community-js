import React, {useMemo} from 'react';
import {useThemeProps} from '@mui/system';
import {Box, Button, Typography, styled} from '@mui/material';
import classNames from 'classnames';
import {SCCustomMenuItemType, SCCustomMenuType} from '@selfcommunity/types';
import {sortByAttr} from '@selfcommunity/utils';
import {Link, SCPreferences, SCPreferencesContextType, useFetchMenuFooter, useSCPreferences} from '@selfcommunity/react-core';
import FooterSkeleton from './Skeleton';
import {PREFIX, EXPLORE_MENU_ITEM} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  itemList: `${PREFIX}-item-list`,
  item: `${PREFIX}-item`,
  copyright: `${PREFIX}-copyright`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
 |item|.SCFooter-item|Styles applied to the item element.|
 |itemList|.SCFooter-item-list|Styles applied to the item list element.|
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

  // HOOKS
  const {_menu, loading} = useFetchMenuFooter(menu);

  // PREFERENCES
  const {preferences}: SCPreferencesContextType = useSCPreferences();
  const copyright = useMemo(() => {
    return preferences && SCPreferences.TEXT_APPLICATION_COPYRIGHT in preferences
      ? preferences[SCPreferences.TEXT_APPLICATION_COPYRIGHT].value.replace('$year', new Date().getFullYear())
      : null;
  }, [preferences]);
  const exploreStreamEnabled = preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED].value;

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
        {sortByAttr(_menu.items, 'order')
          .filter((item: SCCustomMenuItemType) => exploreStreamEnabled || item.url !== EXPLORE_MENU_ITEM)
          .map((item: SCCustomMenuItemType) => (
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
