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
  Zoom,
  styled,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Avatar
} from '@mui/material';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCFetchCategories,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Category, {CategoryProps} from '../Category';
import {FormattedMessage} from 'react-intl';
import {sortByAttr} from '@selfcommunity/utils';
import {SCCategoryType, SCFeatureName} from '@selfcommunity/types';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import BaseItem from '../../shared/BaseItem';
import FormazionePlaceholder from '../../assets/custom/formazione';
import {DefaultCategoryTagName} from '../../constants/DefaultDrawerContent';
import {scroll} from 'seamless-scroll-polyfill';

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
  tagImage?: string;
  onClickHome?: () => void;
}
export default function DefaultDrawerContent(inProps: DefaultDrawerContentProps) {
  const props: DefaultDrawerContentProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, CategoryItemProps = {showTooltip: true}, tagImage = '/', onClickHome, ...rest} = props;

  // HOOKS
  const {categories} = useSCFetchCategories();
  const [categoriesOrdered, setCategoriesOrdered] = useState<SCCategoryType[]>([]);

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // PREFERENCES
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  //STATE
  const [isHovered, setIsHovered] = useState({});
  const [expanded, setExpanded] = useState<string | false>(false);

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
  const coursesEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.COURSE) &&
      SCPreferences.CONFIGURATIONS_COURSES_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_COURSES_ENABLED].value,
    [preferences, features]
  );
  const exploreStreamEnabled = preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED].value;
  const contentAvailable = preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;

  const showAllCategories = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_SIDEBAR_SHOW_ALL_CATEGORIES_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SIDEBAR_SHOW_ALL_CATEGORIES_ENABLED].value,
    [preferences]
  );

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

  const handleChange = (tagName: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? tagName : false);
  };

  const handleClickHome = useCallback(() => {
    if (onClickHome) {
      onClickHome();
    } else {
      const pathName = window.location.pathname;
      if (pathName && (pathName === '/' || pathName === scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {}))) {
        scroll(window, {top: 0, behavior: 'smooth'});
      }
    }
  }, [onClickHome]);

  // Order categories
  useEffect(() => {
    if (!scUserContext.user || (scUserContext.user && showAllCategories)) {
      setCategoriesOrdered(sortByAttr(categories, 'order'));
    } else {
      setCategoriesOrdered(
        sortByAttr(
          categories.filter((cat) => cat.followed),
          'order'
        )
      );
    }
  }, [scUserContext.user, showAllCategories, categories]);

  const getMouseEvents = (mouseEnter: () => void, mouseLeave: () => void) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  const taggedCategories: Record<string, SCCategoryType[]> = {};
  const untaggedCategories: SCCategoryType[] = [];

  categoriesOrdered.forEach((c) => {
    const visibleTags = (c.tags ?? []).filter((tag) => tag.visible);

    if (visibleTags.length > 0) {
      visibleTags.forEach((tag) => {
        if (!taggedCategories[tag.name]) taggedCategories[tag.name] = [];
        taggedCategories[tag.name].push(c);
      });
    } else {
      untaggedCategories.push(c);
    }
  });

  //order
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <List className={classes.navigation}>
        {scUserContext.user && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} onClickHome={handleClickHome}>
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
        )}
        {coursesEnabled && (scUserContext.user || contentAvailable) && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.COURSES_ROUTE_NAME, {})}>
              <ListItemIcon>
                <Icon>courses</Icon>
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ui.navigationMenuIconButton.defaultDrawerContent.navigation.courses"
                    defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.navigation.courses"
                  />
                }
              />
            </ListItemButton>
          </ListItem>
        )}
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
      <>
        {Object.entries(taggedCategories).map(([tagName, categories]) => {
          if (!categories.length || !categories[0].tags?.length) return null;
          return (
            <Accordion
              key={tagName}
              expanded={expanded === tagName}
              onChange={handleChange(tagName)}
              elevation={0}
              onFocus={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}>
              <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                <BaseItem
                  elevation={0}
                  image={<Avatar alt={tagName} src={tagName === DefaultCategoryTagName ? FormazionePlaceholder : tagImage} variant="square" />}
                  primary={tagName}
                  disableTypography={false}
                />
              </AccordionSummary>

              <AccordionDetails>
                <List>
                  {categories.map((c) => (
                    <Zoom in={true} key={c.id}>
                      <ListItem>
                        <Category
                          ButtonBaseProps={{
                            component: Link,
                            to: scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, c)
                          }}
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
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
        {untaggedCategories.length > 0 && (
          <>
            {untaggedCategories.map((c: SCCategoryType, index: number) => (
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
          </>
        )}
      </>
    </Root>
  );
}
