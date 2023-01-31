import {AppBar, Avatar, Badge, Box, IconButton, Toolbar, styled, Tabs, Tab, useTheme, useMediaQuery, Menu, Button, Grid} from '@mui/material';
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
import SnippetNotifications from '../SnippetNotifications';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCHeader';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  registerButton: `${PREFIX}-register-button`,
  tab: `${PREFIX}-tab`,
  tabsL: `${PREFIX}-tabs-left`,
  tabsR: `${PREFIX}-tabs-right`,
  iconButton: `${PREFIX}-icon-button`,
  logoContainer: `${PREFIX}-logo-container`,
  tabsLContainer: `${PREFIX}-tabs-left-container`,
  searchBarContainer: `${PREFIX}-search-bar-container`,
  rightBlockContainer: `${PREFIX}-right-block-container`,
  notificationsMenu: `${PREFIX}-notifications-menu`,
  notificationsContent: `${PREFIX}-notifications-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  position: 'relative',
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
  [`& .${classes.tabsR}`]: {
    marginRight: theme.spacing(3)
  },
  [`& .${classes.logoContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: theme.spacing(3),
    flexGrow: 1
  },
  [`& .${classes.tabsLContainer}`]: {
    flexGrow: 1
  },
  [`& .${classes.searchBarContainer}`]: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
    maxWidth: '40ch'
  },
  [`& .${classes.rightBlockContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    [`& .${classes.tab}`]: {
      minWidth: theme.spacing(5),
      maxWidth: theme.spacing(5)
    }
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
 |tabsLContainer|.SCHeader-tabs-container|Styles applied to the tabs container element|
 |searchBarContainer|.SCHeader-search-bar-container|Styles applied to the search bar container element|
 |rightBlockContainer|.SCHeader-right-block-container|Styles applied to the right container elements|
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
      if (
        (url.home && value === url.home) ||
        (url.explore && value === url.explore) ||
        (url.messages && value === url.messages) ||
        (url.notifications && value === url.notifications)
      ) {
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
              {!scUserContext.user && url && url.register && (
                <Button color="inherit" component={Link} to={url.register} className={classes.registerButton}>
                  <FormattedMessage id="ui.header.button.register" defaultMessage="ui.header.button.register" />
                </Button>
              )}
            </Box>
            {scUserContext.user ? (
              <>
                <Box className={classes.tabsLContainer}>
                  <Tabs
                    className={classes.tabsL}
                    onChange={(e, v) => setValue(v)}
                    value={checkValue()}
                    textColor="inherit"
                    indicatorColor="primary"
                    aria-label="Navigation Tabs_L">
                    {url && url.home && (
                      <Tab
                        className={classes.tab}
                        value={url.home}
                        icon={<Icon>home</Icon>}
                        aria-label="HomePage"
                        to={url.home}
                        component={Link}></Tab>
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
                <Box className={classes.rightBlockContainer}>
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
                  <Tabs
                    className={classes.tabsR}
                    onChange={(e, v) => setValue(v)}
                    value={checkValue()}
                    textColor="inherit"
                    indicatorColor="primary"
                    aria-label="Navigation Tabs_R">
                    {url && url.notifications && (
                      <>
                        <Tab
                          className={classes.tab}
                          value={url.notifications}
                          icon={
                            <Badge badgeContent={scUserContext.user.unseen_interactions_counter} color="error">
                              <Icon>notifications_active</Icon>
                            </Badge>
                          }
                          aria-label="Notifications"
                          onClick={handleOpenNotificationsMenu}
                          component={Button}></Tab>
                        <Menu
                          id="notifications-menu"
                          anchorEl={anchorNotifications}
                          open={Boolean(anchorNotifications)}
                          PaperProps={{
                            style: {
                              width: '200px',
                              transform: 'translateX(-14px) translateY(14px)'
                            },
                            className: classNames(classes.notificationsMenu)
                          }}
                          onClose={handleCloseNotificationsMenu}
                          onClick={handleCloseNotificationsMenu}>
                          <Box className={classes.notificationsContent}>
                            <SnippetNotifications />
                            <Button component={Link} to={url.notifications} sx={{display: 'flex'}}>
                              <FormattedMessage id="ui.header.notifications.button.seeMore" defaultMessage="ui.header.notifications.button.seeMore" />
                            </Button>
                          </Box>
                        </Menu>
                      </>
                    )}
                    {url && url.messages && (
                      <Tab
                        className={classes.tab}
                        value={url.messages}
                        icon={
                          <Badge badgeContent={scUserContext.user.unseen_notification_banners_counter} color="error">
                            <Icon>email</Icon>
                          </Badge>
                        }
                        aria-label="Messages"
                        to={url.messages}
                        component={Link}></Tab>
                    )}
                  </Tabs>
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
              </>
            ) : (
              <>
                <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                  <Box className={classes.searchBarContainer}>
                    <SearchBar {...searchBarProps} />
                  </Box>
                  {url && url.explore && (
                    <Button component={Link} to={url.explore} size="medium" aria-label="Explore" color="inherit">
                      <FormattedMessage id="ui.header.button.explore" defaultMessage="ui.header.button.explore" />
                    </Button>
                  )}
                  {url && url.login && (
                    <Button color="inherit" onClick={url.login}>
                      {' '}
                      <FormattedMessage id="ui.header.button.login" defaultMessage="ui.header.button.login" />
                    </Button>
                  )}
                </Grid>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </Root>
  );
}
