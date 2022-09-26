import {AppBar, Badge, Box, Button, Grid, IconButton, styled, SwipeableDrawer, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useContext, useEffect, useState} from 'react';
import {Link, SCPreferences, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import SearchBar, {HeaderSearchBarProps} from '../SearchBar';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import HeaderMenu from '../HeaderMenu';
import {SCHeaderMenuUrlsType} from '../../../types';
import MobileHeaderSkeleton from './Skeleton';

const PREFIX = 'SCMobileHeader';

const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  topToolbar: `${PREFIX}-top-toolbar`,
  bottomToolbar: `${PREFIX}-bottom-toolbar`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.tabs}`]: {
    '& .MuiTabs-indicator': {
      top: '0px'
    }
  },
  [`& .${classes.topToolbar}`]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  [`& .${classes.bottomToolbar}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  ' & .MuiTab-root': {
    minWidth: '70px',
    maxWidth: '280px',
    [theme.breakpoints.up('sm')]: {
      minWidth: '150px',
      maxWidth: '600px'
    }
  }
}));

const BottomBar = styled(AppBar)({
  position: 'fixed',
  top: 'auto',
  bottom: 0,
  color: 'default'
});

export interface MobileHeaderProps {
  /**
   * Searchbar props
   */
  searchBarProps?: HeaderSearchBarProps;
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
   * If true, adds a navigation button to mobile header
   */
  showNavigation?: boolean;
  /**
   * Header section showed when entering certain urls
   */
  navigationHeaderProps?: {
    title?: string;
    onNavigationBack?: () => any;
  };
  /**
   * Other props
   */
  [p: string]: any;
}

export default function MobileHeader(inProps: MobileHeaderProps) {
  // PROPS
  const props: MobileHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {url, className, searchBarProps, showNavigation, navigationHeaderProps, ...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [value, setValue] = React.useState(window ? window.location.pathname : null);
  // PREFERENCES
  const scPreferences = useSCPreferences();
  const logo = scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const handleOpenSettingsMenu = () => {
    setOpenSettings(true);
  };
  const toggleDrawer = (anchor: 'right', open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
  };
  const handleOpenDrawer = () => {
    setOpenSettings(false);
    if (window) {
      setValue(window.location.pathname);
    }
  };

  const handleChange = (e, v) => {
    setValue(v);
  };

  const checkValue = () => {
    if (url) {
      if (
        (url.home && value === url.home) ||
        (url.explore && value === url.explore) ||
        (url.followings && value === url.followings) ||
        (url.notifications && value === url.notifications)
      ) {
        return true;
      }
      return null;
    }
  };

  useEffect(() => {
    const getSelectedTab = JSON.parse(localStorage.getItem('selectedTab'));
    if (getSelectedTab) {
      setValue(getSelectedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTab', JSON.stringify(value));
  }, [value]);

  if (scUserContext.loading) {
    return <MobileHeaderSkeleton />;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AppBar position="fixed" color={'default'}>
        <Toolbar className={classes.topToolbar}>
          <Grid container direction="row" justifyContent="flex-start">
            {!showNavigation && (
              <Link to={scUserContext.user && url ? url.home : '/'}>
                <img src={logo} alt={'logo'} style={{height: '30px'}} />
              </Link>
            )}
            {scUserContext.user && showNavigation && navigationHeaderProps && (
              <Typography component="div">
                <IconButton onClick={navigationHeaderProps.onNavigationBack} size="large" aria-label="back" color="inherit">
                  <Icon>arrow_back</Icon>
                </IconButton>
                {navigationHeaderProps.title}
              </Typography>
            )}
          </Grid>
          <SearchBar {...searchBarProps} />
          {scUserContext.user && url && url.create && (
            <IconButton component={Link} to={url.create} size="large" aria-label="New Contribute" color="inherit">
              <Icon>create</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <BottomBar>
        {scUserContext.user ? (
          <Toolbar className={classes.bottomToolbar}>
            <Tabs
              className={classes.tabs}
              onChange={handleChange}
              value={value}
              textColor="primary"
              indicatorColor={checkValue() ? 'primary' : null}
              aria-label="Navigation Tabs"
              variant="scrollable">
              {url && url.home && <Tab value={url.home} icon={<Icon>home</Icon>} aria-label="HomePage" to={url.home} component={Link}></Tab>}
              {url && url.explore && (
                <Tab value={url.explore} icon={<Icon>explore</Icon>} aria-label="Explore" to={url.explore} component={Link}></Tab>
              )}
              {url && url.followings && (
                <Tab value={url.followings} icon={<Icon>person</Icon>} aria-label="Followings" to={url.followings} component={Link}></Tab>
              )}
              {url && url.notifications && (
                <Tab
                  value={url.notifications}
                  icon={
                    <Badge badgeContent={scUserContext.user.unseen_interactions_counter} color="error">
                      <Icon>notifications</Icon>
                    </Badge>
                  }
                  aria-label="Notifications"
                  to={url.notifications}
                  component={Link}></Tab>
              )}
            </Tabs>
            <IconButton onClick={handleOpenSettingsMenu}>
              <Icon>menu</Icon>
            </IconButton>
            <SwipeableDrawer
              PaperProps={{
                sx: {width: '85%'}
              }}
              anchor={'right'}
              open={openSettings}
              onClick={handleOpenDrawer}
              onClose={() => setOpenSettings(false)}
              onOpen={toggleDrawer('right', true)}>
              <HeaderMenu url={url} />
            </SwipeableDrawer>
          </Toolbar>
        ) : (
          <Toolbar sx={{justifyContent: 'space-between'}}>
            {url && url.explore && (
              <Button component={Link} to={url.explore} size="medium" color="inherit">
                <FormattedMessage id="ui.header.button.explore" defaultMessage="ui.header.button.explore" />
              </Button>
            )}
            {url && url.login && (
              <Button color="inherit" onClick={url.login}>
                <FormattedMessage id="ui.header.button.login" defaultMessage="ui.header.button.login" />
              </Button>
            )}
            {url && url.register && (
              <Button color="inherit" component={Link} to={url.register}>
                <FormattedMessage id="ui.header.button.register" defaultMessage="ui.header.button.register" />
              </Button>
            )}
          </Toolbar>
        )}
      </BottomBar>
    </Root>
  );
}
