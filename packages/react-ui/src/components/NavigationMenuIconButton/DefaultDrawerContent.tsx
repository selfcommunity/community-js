import {Button, ListItem, Typography, Zoom} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchCategories, useSCRouting} from '@selfcommunity/react-core';
import React, {useEffect, useState} from 'react';
import Category from '../Category';
import {FormattedMessage} from 'react-intl';
import {sortByAttr} from '@selfcommunity/utils';
import {SCCategoryType} from '@selfcommunity/types';

export default function DefaultDrawerContent() {
  // HOOKS
  const {categories} = useSCFetchCategories();
  const [categoriesOrdered, setCategoriesOrdered] = useState<SCCategoryType[]>([]);

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  //STATE
  const [isHovered, setIsHovered] = useState({});

  // HANDLERS
  const handleMouseEnter = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: true};
    });
  };

  const handleMouseLeave = (index) => {
    setIsHovered((prevState) => {
      return {...prevState, [index]: false};
    });
  };

  // Order categories
  useEffect(() => {
    setCategoriesOrdered(sortByAttr(categories, 'order'));
  }, [categories]);

  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  //order
  return (
    <>
      <Typography variant="subtitle1">
        <span>
          <FormattedMessage
            id="ui.navigationMenuIconButton.defaultDrawerContent.category.title"
            defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.category.title"
          />
        </span>{' '}
        <Button variant="text" component={Link} color="secondary" to={scRoutingContext.url(SCRoutes.CATEGORIES_LIST_ROUTE_NAME, {})}>
          <FormattedMessage
            id="ui.navigationMenuIconButton.defaultDrawerContent.category.seeAll"
            defaultMessage="ui.navigationMenuIconButton.defaultDrawerContent.category.seeAll"
          />
        </Button>
      </Typography>
      {categoriesOrdered.map((c: SCCategoryType, index: number) => (
        <Zoom in={true} style={{transform: isHovered[c.id] && 'scale(1.05)'}} key={index}>
          <ListItem key={c.id}>
            <Category
              ButtonBaseProps={{component: Link, to: scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, c)}}
              elevation={0}
              category={c}
              actions={null}
              {...getMouseEvents(
                () => handleMouseEnter(c.id),
                () => handleMouseLeave(c.id)
              )}
            />
          </ListItem>
        </Zoom>
      ))}
    </>
  );
}
