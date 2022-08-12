import {
  AppBar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  styled,
  SwipeableDrawer,
  Tab,
  Tabs,
  Toolbar
} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useContext, useState} from 'react';
import {
  Link,
  SCPreferences, 
  SCUserContext,
  SCUserContextType,
  useSCPreferences,
} from '@selfcommunity/react-core';
import { useThemeProps } from '@mui/system';
import SearchBar from '../SearchBar';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import HeaderMenu from '../HeaderMenu';
import {SCHeaderMenuUrlsType} from '../../../types';

const PREFIX = 'SCMobileHeader';

const classes = {
  root: `${PREFIX}-root`,
  tabs: `${PREFIX}-tabs`,
  settingsTab: `${PREFIX}-setting-tab`,
  topToolbar: `${PREFIX}-top-toolbar`,
  bottomToolbar: `${PREFIX}-bottom-toolbar`,
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.tabs}`]: {
    '& .MuiTabs-indicator': {
      top: '0px',
    }
  },
  [`& .${classes.settingsTab}`]: {
    '& .MuiTabs-indicator': {
      top: '0px',
      backgroundColor: '#000000',
      opacity: 0
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
      maxWidth: '600px',
    },
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
   * OnSearchCallback
   */
  onSearch?: () => void;
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

export default function MobileHeader (inProps: MobileHeaderProps) {
  // PROPS
  const props: MobileHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {url, className, onSearch,...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [value, setValue] = React.useState(0);
  // PREFERENCES
  const scPreferences = useSCPreferences();
  const logo = scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const handleOpenSettingsMenu = () => {
    setOpenSettings(true);
  };
    const toggleDrawer =
      (anchor: 'right', open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
          if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
          ) {
            return;
          }
        }

  return (
    <Root  className={classNames(classes.root, className)}>
        <AppBar position="fixed" color={'default'}>
        <Toolbar className={classes.topToolbar}>
          <Grid container direction="row" justifyContent="flex-start">
            {scUserContext.user && url && url.home ?
              <Link href={url.home}><img src={logo} alt={'logo'} style={{height: '30px'}}/></Link> :
              <Link href={'/'}><img src={logo} alt={'logo'} style={{height: '30px'}}/></Link>}
          </Grid>
          <SearchBar handleSearch={onSearch}/>
          {scUserContext.user && url && url.create && (
            <IconButton
              component={Link}
              to={url.create}
              size="large"
              aria-label="New Contribute"
              color="inherit"
            >
              <Icon>create</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <BottomBar>
        {scUserContext.user ?
          <Toolbar className={classes.bottomToolbar}>
            <Tabs
              className={value === 4 ? classes.settingsTab : classes.tabs}
              onChange={(e, v) => setValue(v)}
              value={value}
              textColor="inherit"
              indicatorColor="primary"
              aria-label="Navigation Tabs"
              variant="scrollable"
            >
              {url && url.home &&(<Tab icon={<Icon>home</Icon>} aria-label='HomePage' href={url.home} component={Link}></Tab>)}
              {url && url.explore &&(<Tab icon={<Icon>explore</Icon>} aria-label='Explore' href={url.explore} component={Link}></Tab>)}
              {url && url.followings &&<Tab icon={<Icon>person</Icon>} aria-label='Followings' href={url.followings} component={Link}></Tab>}
              {url && url.notifications &&(<Tab icon={<Badge badgeContent={scUserContext.user.unseen_interactions_counter}
                                 color='error'><Icon>notifications</Icon></Badge>} aria-label='Notifications'
                    href={url.notifications}
                    component={Link}></Tab>)}
              <Tab className={classes.settingsTab} icon={<Icon>menu</Icon>} aria-label="HeaderMenu"  onClick={handleOpenSettingsMenu}></Tab>
              <SwipeableDrawer
                anchor={'right'}
                open={openSettings}
                onClose={() =>setOpenSettings(false)}
                onOpen={toggleDrawer('right', true)}
              >
                <HeaderMenu url={url}/>
              </SwipeableDrawer>
            </Tabs>
          </Toolbar>
          :
          <Toolbar sx={{justifyContent: 'space-between'}}>
            {url && url.explore && (
            <Button component={Link} to={url.explore} size="medium" color="inherit"><FormattedMessage id="ui.header.button.explore" defaultMessage="ui.header.button.explore" /></Button>
              )}
            {url && url.login && (
              <Button color="inherit"  onClick={url.login}><FormattedMessage id="ui.header.button.login" defaultMessage="ui.header.button.login" /></Button>
              )}
            {url && url.register && (
              <Button color="inherit" component={Link} to={url.register}><FormattedMessage id="ui.header.button.register" defaultMessage="ui.header.button.register" /></Button>
              )}
          </Toolbar>
        }
      </BottomBar>
    </Root>
  );
}
