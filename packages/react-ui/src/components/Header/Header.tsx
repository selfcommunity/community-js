import {AppBar, Avatar, Badge, Box, IconButton, Toolbar, styled, Tabs, Tab, useTheme, useMediaQuery, Menu} from '@mui/material';
import React, {useContext, useEffect, useMemo} from 'react';
import {
  SCPreferences,
  useSCPreferences,
  Link,
  SCUserContext,
  SCThemeType,
  SCRoutes,
  SCRoutingContextType,
  useSCRouting
} from '@selfcommunity/react-core';
import {SCUserContextType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import MobileHeader from './MobileHeader/MobileHeader';
import {useThemeProps} from '@mui/system';
import SearchBar, {HeaderSearchBarProps} from './SearchBar';
import classNames from 'classnames';
import HeaderMenu from './HeaderMenu';
import {SCHeaderMenuUrlsType} from '../../types';
import HeaderSkeleton from './Skeleton';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import SnippetNotifications from '../SnippetNotifications';

const PREFIX = 'SCHeader';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  registerButton: `${PREFIX}-register-button`,
  tab: `${PREFIX}-tab`,
  iconButton: `${PREFIX}-icon-button`,
  logoContainer: `${PREFIX}-logo-container`,
  tabsContainer: `${PREFIX}-tabs-container`,
  searchBarContainer: `${PREFIX}-search-bar-container`,
  iconButtonsContainer: `${PREFIX}-icon-buttons-container`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  flexGrow: 1,
  [`& .${classes.logo}`]: {
    height: theme.spacing(4)
  },
  [`& .${classes.registerButton}`]: {
    marginLeft: theme.spacing(2)
  },
  [`& .${classes.iconButton}`]: {
    whiteSpace: 'nowrap',
    overFlow: 'hidden',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  [`& .${classes.tab}`]: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  '& .SCHeader-icon-button-settings': {
    marginLeft: theme.spacing(3)
  },
  [`& .${classes.logoContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: '24px',
    flexGrow: 2
  },
  [`& .${classes.tabsContainer}`]: {
    flexGrow: 1
  },
  [`& .${classes.searchBarContainer}`]: {
    marginRight: theme.spacing(2)
  },
  [`& .${classes.iconButtonsContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  }
}));

export interface HeaderProps {
  /**
   * Searchbar props
   */
  searchBarProps?: HeaderSearchBarProps;
  /**
   * If true, adds a navigation button to mobile header
   */
  showNavigation?: boolean;
  /**
   * Callback fired when navigating back
   */
  onNavigationBack?: () => any;
  /**
   * The single pages url to pass to menu
   */
  url?: SCHeaderMenuUrlsType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Header component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {Header} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCHeader-root|Styles applied to the root element.|
 |registerButton|.SCHeader-register-button|Styles applied to the register button element.|
 |iconButton|.SCHeader-icon-button|Styles applied to the icon button elements.|
 |logoContainer|.SCHeader-logo-container|Styles applied to the logo container element|
 |tabsContainer|.SCHeader-tabs-container|Styles applied to the tabs container element|
 |searchBarContainer|.SCHeader-search-bar-container|Styles applied to the search bar container element|
 |iconButtonsContainer|.SCHeader-icon-buttons-container|Styles applied to the icon buttons container element|
 *
 * @param inProps
 */
export default function Header(inProps: HeaderProps) {
  // PROPS
  const props: HeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {url, className, searchBarProps, showNavigation, onNavigationBack, ...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences = useSCPreferences();
  const logo = useMemo(() => {
    return scPreferences.preferences && SCPreferences.LOGO_NAVBAR_LOGO in scPreferences.preferences
      ? scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value
      : null;
  }, [scPreferences.preferences]);

  // STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const path = typeof window !== 'undefined' ? window.location.pathname : null;
  const [value, setValue] = React.useState(path);
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const [anchorNotifications, setAnchorNotifications] = React.useState(null);

  // HANDLERS
  const handleOpenSettingsMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorMenu(null);
  };
  const handleOpenNotificationsMenu = (event) => {
    setAnchorNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorNotifications(null);
  };

  const checkValue = () => {
    if (url) {
      if ((url.home && value === url.home) || (url.explore && value === url.explore)) {
        return value;
      }
      return false;
    }
  };

  useEffect(() => {
    setValue(path);
  }, [path]);

  if (scUserContext.loading) {
    return <HeaderSkeleton />;
  } else if (!scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {isMobile ? (
        <MobileHeader url={url} searchBarProps={searchBarProps} showNavigation={showNavigation} onNavigationBack={onNavigationBack} />
      ) : (
        <AppBar position="fixed" color={'default'}>
          <Toolbar>
            <Box className={classes.logoContainer}>
              {url && url.home && (
                <Link to={url.home}>
                  <img src={logo} alt={'logo'} className={classes.logo} />
                </Link>
              )}
              {/*{!scUserContext.user && url && url.register && (*/}
              {/*  <Button color="inherit" component={Link} to={url.register} className={classes.registerButton}>*/}
              {/*    <FormattedMessage id="ui.header.button.register" defaultMessage="ui.header.button.register" />*/}
              {/*  </Button>*/}
              {/*)}*/}
            </Box>
            {/*{scUserContext.user ? (*/}
            {/*  <>*/}
            <Box className={classes.tabsContainer}>
              <Tabs onChange={(e, v) => setValue(v)} value={checkValue()} textColor="inherit" indicatorColor="primary" aria-label="Navigation Tabs">
                {url && url.home && (
                  <Tab className={classes.tab} value={url.home} icon={<Icon>home</Icon>} aria-label="HomePage" to={url.home} component={Link}></Tab>
                )}
                {url && url.explore && (
                  <Tab
                    className={classes.tab}
                    value={url.explore}
                    icon={<Icon>explore</Icon>}
                    aria-label="Explore"
                    to={url.explore}
                    component={Link}></Tab>
                )}
              </Tabs>
            </Box>
            <Box className={classes.searchBarContainer}>
              <SearchBar {...searchBarProps} />
            </Box>
            <Box className={classes.iconButtonsContainer}>
              <IconButton
                component={Link}
                to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}
                onClick={() => setValue('profile')}
                size="large"
                aria-label="Profile"
                color="inherit"
                className={classes.iconButton}>
                <Badge color="error">
                  <Avatar alt={scUserContext.user.username} src={scUserContext.user.avatar} />
                </Badge>
              </IconButton>
              <IconButton onClick={handleOpenNotificationsMenu} className={classes.iconButton}>
                <Badge badgeContent={scUserContext.user.unseen_interactions_counter} color="error">
                  <Icon>notifications_active</Icon>
                </Badge>
              </IconButton>
              <Menu
                id="notifications-menu"
                anchorEl={anchorNotifications}
                open={Boolean(anchorNotifications)}
                PaperProps={{
                  style: {
                    width: '200px',
                    transform: 'translateX(-14px) translateY(14px)'
                  }
                }}
                onClose={handleCloseNotificationsMenu}
                onClick={handleCloseNotificationsMenu}>
                <SnippetNotifications />
              </Menu>
              {url && url.messages && (
                <IconButton
                  component={Link}
                  to={url.messages}
                  onClick={() => setValue(url.messages)}
                  size="large"
                  aria-label="Messages"
                  color="inherit"
                  className={classes.iconButton}>
                  <Badge badgeContent={scUserContext.user.unseen_notification_banners_counter} color="error">
                    <Icon>email</Icon>
                  </Badge>
                </IconButton>
              )}
              <IconButton onClick={handleOpenSettingsMenu} className={classNames(classes.iconButton, `${classes.iconButton}-settings`)}>
                {anchorMenu ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                open={Boolean(anchorMenu)}
                PaperProps={{
                  style: {
                    transform: 'translateX(14px) translateY(14px)'
                  }
                }}
                onClose={handleCloseSettingsMenu}
                onClick={handleCloseSettingsMenu}>
                <HeaderMenu url={url} />
              </Menu>
            </Box>
            {/*  </>*/}
            {/*) : (*/}
            {/*  <HiddenPlaceholder />*/}
            {/*  <>*/}
            {/*    <Grid container direction="row" justifyContent="flex-end" alignItems="center">*/}
            {/*      <SearchBar {...searchBarProps} />*/}
            {/*      {url && url.explore && (*/}
            {/*        <Button component={Link} to={url.explore} size="medium" aria-label="Explore" color="inherit">*/}
            {/*          <FormattedMessage id="ui.header.button.explore" defaultMessage="ui.header.button.explore" />*/}
            {/*        </Button>*/}
            {/*      )}*/}
            {/*      {url && url.login && (*/}
            {/*        <Button color="inherit" onClick={url.login}>*/}
            {/*          {' '}*/}
            {/*          <FormattedMessage id="ui.header.button.login" defaultMessage="ui.header.button.login" />*/}
            {/*        </Button>*/}
            {/*      )}*/}
            {/*    </Grid>*/}
            {/*  </>*/}
            {/*)}*/}
          </Toolbar>
        </AppBar>
      )}
    </Root>
  );
}
