import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  styled,
  Grid,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Menu
} from '@mui/material';
import React, {useContext} from 'react';
import {SCPreferences, useSCPreferences, Link, SCUserContext} from '@selfcommunity/react-core';
import {SCUserContextType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import MobileHeader from './MobileHeader/MobileHeader';
import {useThemeProps} from '@mui/system';
import SearchBar, {HeaderSearchBarProps} from './SearchBar';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import HeaderMenu from './HeaderMenu';
import {SCHeaderMenuUrlsType} from '../../types';

const PREFIX = 'SCHeader';

const classes = {
  root: `${PREFIX}-root`,
  registerButton: `${PREFIX}-register-button`,
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
  [`& .${classes.registerButton}`]: {
    marginLeft: theme.spacing(2)
  },
  [`& .${classes.iconButton}`]: {
    whiteSpace: 'nowrap',
    overFlow: 'hidden'
  },
  ' & .MuiTab-root': {
    minWidth: '130px',
    maxWidth: '520px'
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
    marginRight: '24px',
    flexGrow: 1,
    maxWidth: '25ch'
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
  const {url, className, searchBarProps, ...rest} = props;
  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PREFERENCES
  const scPreferences = useSCPreferences();
  const logo = scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpenSettingsMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Root className={classNames(classes.root, className)}>
      {isMobile ? (
        <MobileHeader url={url} searchBarProps={searchBarProps} />
      ) : (
        <AppBar position="fixed" color={'default'}>
          <Toolbar>
            <Box className={classes.logoContainer}>
              {scUserContext.user && url && url.home ? (
                <Link to={url.home}>
                  <img src={logo} alt={'logo'} style={{height: '30px'}} />
                </Link>
              ) : (
                <Link to={'/'}>
                  <img src={logo} alt={'logo'} style={{height: '30px'}} />
                </Link>
              )}
              {!scUserContext.user && url && url.register && (
                <Button color="inherit" component={Link} to={url.register} className={classes.registerButton}>
                  sign up
                </Button>
              )}
            </Box>
            {scUserContext.user ? (
              <>
                <Box className={classes.tabsContainer}>
                  <Tabs onChange={(e, v) => setValue(v)} value={value} textColor="inherit" indicatorColor="primary" aria-label="Navigation Tabs">
                    {url && url.home && <Tab icon={<Icon>home</Icon>} aria-label="HomePage" to={url.home} component={Link}></Tab>}
                    {url && url.explore && <Tab icon={<Icon>explore</Icon>} aria-label="Explore" to={url.explore} component={Link}></Tab>}
                    {url && url.followings && <Tab icon={<Icon>person</Icon>} aria-label="Followings" to={url.followings} component={Link}></Tab>}
                  </Tabs>
                </Box>
                <Box className={classes.searchBarContainer}>
                  <SearchBar {...searchBarProps} />
                </Box>
                <Box className={classes.iconButtonsContainer}>
                  {url && url.profile && (
                    <IconButton component={Link} to={url.profile} size="large" aria-label="Profile" color="inherit" className={classes.iconButton}>
                      <Badge color="error">
                        <Avatar alt="Remy Sharp" src={scUserContext.user.avatar} />
                      </Badge>
                    </IconButton>
                  )}
                  {url && url.create && (
                    <IconButton
                      component={Link}
                      to={url.create}
                      size="large"
                      aria-label="New Contribute"
                      color="inherit"
                      className={classes.iconButton}>
                      <Badge color="error">
                        <Icon>add_circle_outline</Icon>
                      </Badge>
                    </IconButton>
                  )}
                  {url && url.notifications && (
                    <IconButton
                      component={Link}
                      to={url.notifications}
                      size="large"
                      aria-label="Notifications"
                      color="inherit"
                      className={classes.iconButton}>
                      <Badge badgeContent={scUserContext.user.unseen_interactions_counter} color="error">
                        <Icon>notifications</Icon>
                      </Badge>
                    </IconButton>
                  )}
                  <Tooltip title="HeaderMenu">
                    <IconButton onClick={handleOpenSettingsMenu} className={classes.iconButton}>
                      <Icon>expand_more</Icon>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseSettingsMenu}
                    onClick={handleCloseSettingsMenu}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}>
                    <HeaderMenu url={url} />
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                  <SearchBar {...searchBarProps} />
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
