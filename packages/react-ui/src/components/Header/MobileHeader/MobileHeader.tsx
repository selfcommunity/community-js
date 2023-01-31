import {AppBar, Badge, Box, Grid, IconButton, styled, SwipeableDrawer, Tab, Tabs, Toolbar, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Link, SCPreferences, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import SearchBar, {HeaderSearchBarProps} from '../SearchBar';
import classNames from 'classnames';
import HeaderMenu from '../HeaderMenu';
import {SCHeaderMenuUrlsType} from '../../../types';
import MobileHeaderSkeleton from './Skeleton';
import {SCFeedObjectTypologyType} from '@selfcommunity/types';
import HiddenPlaceholder from '../../../shared/HiddenPlaceholder';
import SnippetNotifications from '../../SnippetNotifications';

const PREFIX = 'SCMobileHeader';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  tabs: `${PREFIX}-tabs`,
  iconButton: `${PREFIX}-icon-button`,
  topToolbar: `${PREFIX}-top-toolbar`,
  bottomToolbar: `${PREFIX}-bottom-toolbar`,
  gridContainer: `${PREFIX}-grid-container`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.logo}`]: {
    height: theme.spacing(4)
  },
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
  [`& .${classes.gridContainer}`]: {
    direction: 'row',
    justifyContent: 'flex-start'
  },
  [`& .${classes.gridContainer}-width`]: {
    width: '30%'
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
   * Callback fired when navigating back
   */
  onNavigationBack?: () => any;
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
  const {url, className, searchBarProps, showNavigation, onNavigationBack, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const setInitialTitle = (title, path) => {
    let p = path.replace(/^\/([^/]*).*$/, '$1');
    if (
      p.startsWith(SCFeedObjectTypologyType.POST) ||
      p.startsWith(SCFeedObjectTypologyType.DISCUSSION) ||
      p.startsWith(SCFeedObjectTypologyType.STATUS)
    ) {
      return '';
    }
    return title;
  };
  // STATE
  const path = typeof window !== 'undefined' ? window.location.pathname : null;
  const [value, setValue] = useState(path);
  const t = typeof document !== 'undefined' ? document.title.split('|')[0] : '';
  const [title, setTitle] = useState(() => setInitialTitle(t, path));
  const [clicked, setClicked] = useState(false);

  // PREFERENCES
  const scPreferences = useSCPreferences();
  const logo = useMemo(() => {
    return scPreferences.preferences && SCPreferences.LOGO_NAVBAR_LOGO in scPreferences.preferences
      ? scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value
      : null;
  }, [scPreferences.preferences]);

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openNotifications, setOpenNotifications] = useState<boolean>(false);

  // HANDLERS

  const handleOpenSettingsMenu = () => {
    setOpenSettings(true);
  };
  const toggleDrawer = (anchor: 'right', open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
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
        (url.notifications && value === url.notifications) ||
        (url.messages && value === url.messages)
      ) {
        return value;
      }
      return false;
    }
  };

  useEffect(() => {
    setValue(path);
    if (showNavigation && typeof document !== 'undefined') {
      setTitle(() => setInitialTitle(document.title.split('|')[0], path));
    }
  }, [path]);

  if (scUserContext.loading) {
    return <MobileHeaderSkeleton />;
  } else if (!scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AppBar position="fixed" color={'default'}>
        <Toolbar className={classes.topToolbar}>
          <Grid container className={clicked ? `${classes.gridContainer}-width` : classes.gridContainer}>
            {!showNavigation && url && url.home && (
              <Link to={url.home}>
                <img src={logo} alt={'logo'} className={classes.logo} />
              </Link>
            )}
            {scUserContext.user && showNavigation && onNavigationBack && !clicked && (
              <Typography component="div">
                <IconButton onClick={onNavigationBack} size="large" aria-label="back" color="inherit">
                  <Icon>arrow_back</Icon>
                </IconButton>
                {title}
              </Typography>
            )}
          </Grid>
          <SearchBar {...searchBarProps} showNavigation={showNavigation} onClick={() => setClicked(!clicked)} />
        </Toolbar>
      </AppBar>
      <BottomBar>
        <Toolbar className={classes.bottomToolbar}>
          <Tabs
            className={classes.tabs}
            onChange={handleChange}
            value={checkValue()}
            textColor="primary"
            indicatorColor="primary"
            aria-label="Navigation Tabs"
            variant="scrollable">
            {url && url.home && <Tab value={url.home} icon={<Icon>home</Icon>} aria-label="HomePage" to={url.home} component={Link}></Tab>}
            {url && url.explore && <Tab value={url.explore} icon={<Icon>explore</Icon>} aria-label="Explore" to={url.explore} component={Link}></Tab>}
            <Tab
              value={url && url.notifications}
              icon={
                <Badge badgeContent={scUserContext.user.unseen_interactions_counter} color="error">
                  <Icon>notifications_active</Icon>{' '}
                </Badge>
              }
              aria-label="Notifications"
              onClick={() => setOpenNotifications(true)}></Tab>
            <SwipeableDrawer
              PaperProps={{
                sx: {width: '85%', '& .SCSnippetNotifications-root .SCSnippetNotifications-notifications-wrap': {height: '100vh'}}
              }}
              anchor={'right'}
              open={openNotifications}
              onClick={() => setOpenNotifications(false)}
              onClose={() => setOpenNotifications(false)}
              onOpen={toggleDrawer('right', true)}>
              <SnippetNotifications />
            </SwipeableDrawer>
            {url && url.messages && (
              <Tab value={url.messages} icon={<Icon>email</Icon>} aria-label="Messages" to={url.messages} component={Link}></Tab>
            )}
          </Tabs>
          <IconButton className={classes.iconButton} onClick={handleOpenSettingsMenu}>
            <Icon>more_vert</Icon>
          </IconButton>
          <SwipeableDrawer
            PaperProps={{
              sx: {width: '85%'}
            }}
            anchor={'right'}
            open={openSettings}
            onClick={() => setOpenSettings(false)}
            onClose={() => setOpenSettings(false)}
            onOpen={toggleDrawer('right', true)}>
            <HeaderMenu url={url} />
          </SwipeableDrawer>
        </Toolbar>
      </BottomBar>
    </Root>
  );
}
