import {ListItem, Zoom} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchCategories, useSCRouting} from '@selfcommunity/react-core';
import React, {useState} from 'react';
import Category from '../Category';

export default function DefaultDrawerContent() {
  // HOOKS
  const {categories} = useSCFetchCategories();
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

  const getMouseEvents = (mouseEnter, mouseLeave) => ({
    onMouseEnter: mouseEnter,
    onMouseLeave: mouseLeave,
    onTouchStart: mouseEnter,
    onTouchMove: mouseLeave
  });

  return (
    <>
      {categories.map((c, index) => (
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
