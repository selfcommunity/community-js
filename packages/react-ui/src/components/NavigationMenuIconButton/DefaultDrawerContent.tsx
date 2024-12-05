import {
  Box,
  BoxProps,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useSCFetchCategories,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import React, {useEffect, useMemo, useState} from 'react';
import Category, {CategoryProps} from '../Category';
import {FormattedMessage} from 'react-intl';
import {sortByAttr} from '@selfcommunity/utils';
import {SCCategoryType, SCFeatureName} from '@selfcommunity/types';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCDefaultDrawerContent';

const classes = {
  root: `${PREFIX}-root`,
  navigation: `${PREFIX}-navigation`,
  noResults: `${PREFIX}-no-results`,
  title: `${PREFIX}-title`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(() => ({}));

export interface DefaultDrawerContentProps extends BoxProps {
  CategoryItemProps?: CategoryProps;
}
export default function DefaultDrawerContent(inProps: DefaultDrawerContentProps) {
  const props: DefaultDrawerContentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, CategoryItemProps = {showTooltip: true}, ...rest} = props;

  // HOOKS
  const {categories} = useSCFetchCategories();
  const [categoriesOrdered, setCategoriesOrdered] = useState<SCCategoryType[]>([]);

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // PREFERENCES
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  //STATE
  const [isHovered, setIsHovered] = useState({});

  // MEMO
  const groupsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.GROUPING) &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value,
    [preferences, features]
  );
  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );
  const exploreStreamEnabled = preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED].value;
  const contentAvailable = preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  // HANDLERS
  const handleMouseEnter = (index: number) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: true};
    });
  };

  const handleMouseLeave = (index: number) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: false};
    });
  };

  // Order categories
  useEffect(() => {
    setCategoriesOrdered(sortByAttr(categories, 'order'));
  }, [categories]);

  const getMouseEvents = (mouseEnter: () => void, mouseLeave: () => void) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  //order
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {isMobile && (
        <>
          <List className={classes.navigation}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}>
                <ListItemIcon>
                  <Icon>home</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <FormattedMessage
                      id="ui.navigationMenuIconButton.defaultDrawerContent.navigation.home"
                      defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.navigation.home"
                    />
                  }
                />
              </ListItemButton>
            </ListItem>
            {groupsEnabled && scUserContext.user && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.GROUPS_ROUTE_NAME, {})}>
                  <ListItemIcon>
                    <Icon>groups</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ui.navigationMenuIconButton.defaultDrawerContent.navigation.groups"
                        defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.navigation.groups"
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
            {eventsEnabled && (scUserContext.user || contentAvailable) && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.EVENTS_ROUTE_NAME, {})}>
                  <ListItemIcon>
                    <Icon>CalendarIcon</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ui.navigationMenuIconButton.defaultDrawerContent.navigation.events"
                        defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.navigation.events"
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
            {exploreStreamEnabled && (contentAvailable || scUserContext.user) && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {})}>
                  <ListItemIcon>
                    <Icon>explore</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ui.navigationMenuIconButton.defaultDrawerContent.navigation.explore"
                        defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.navigation.explore"
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
        </>
      )}
      <Typography variant="subtitle1" className={classes.title}>
        <FormattedMessage
          id="ui.navigationMenuIconButton.defaultDrawerContent.category.title"
          defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.category.title"
        />
      </Typography>
      {!categoriesOrdered.length && (
        <Typography variant="body1" className={classes.noResults}>
          <FormattedMessage
            id="ui.navigationMenuIconButton.defaultDrawerContent.category.noResults"
            defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.category.noResults"
          />
        </Typography>
      )}
      {categoriesOrdered.map((c: SCCategoryType, index: number) => (
        <Zoom in={true} style={{transform: isHovered[c.id] && 'scale(1.05)'}} key={index}>
          <ListItem key={c.id}>
            <Category
              ButtonBaseProps={{component: Link, to: scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, c)}}
              elevation={0}
              category={c}
              actions={null}
              {...CategoryItemProps}
              {...getMouseEvents(
                () => handleMouseEnter(c.id),
                () => handleMouseLeave(c.id)
              )}
            />
          </ListItem>
        </Zoom>
      ))}
    </Root>
  );
}
