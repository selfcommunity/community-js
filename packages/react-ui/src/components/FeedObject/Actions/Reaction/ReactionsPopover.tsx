import {Box, styled, Popover, List, ListItem, useMediaQuery, useTheme, ClickAwayListener} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useRef, useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCReactionType} from '@selfcommunity/types';

const PREFIX = 'SCReactionsPopover';

const classes = {
  root: `${PREFIX}-root`,
  reactionsMenu: `${PREFIX}-reactions-menu`,
  reactionsList: `${PREFIX}-reactions-list`,
  arrowIcon: `${PREFIX}-arrow-icon`
};

const Root = styled(Popover, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  cursor: 'pointer',
  '& .MuiPaper-root': {
    borderRadius: '40px',
    paddingBottom: '4px',
    paddingTop: '4px'
    //position: 'fixed',
  },
  [`.${classes.reactionsMenu}`]: {
    width: 200,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  },
  [`& .${classes.reactionsList}`]: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    maxWidth: ' 100%',
    overflowX: 'scroll',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      background: 'transparent',
      webkitAppearance: 'none',
      width: 0,
      height: 0
    }
  }
}));

export interface ReactionPopoverProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The popover id
   */
  id: string;
  /**
   * The reaction objs to show.
   * @default []
   */
  reactions: SCReactionType[];
  /**
   * Manages popover open state
   * @default false
   */
  open: boolean;
  /**
   * The popover anchor element
   */
  anchorEl: HTMLElement | null;
  /**
   * Callback fired when hovering anchor element
   */
  onOpen?: () => void;
  /**
   * Callback fired when unhovering anchor element
   */
  onClose?: (e?: any) => void;
  /**
   * Callback fired when selecting a reaction from the menu
   */
  onReactionSelection: (reaction) => void;
  /**
   * Other props
   */
  [p: string]: any;
}

export default function ReactionsPopover(inProps: ReactionPopoverProps) {
  // PROPS
  const props: ReactionPopoverProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open, reactions, anchorEl, onClose, onReactionSelection, onOpen, id, ...rest} = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scroll = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollRight, setScrollRight] = useState(false);

  /**
   * Manages right/left scrolling
   *
   * @param shift
   */
  const slide = (shift: number) => {
    scroll.current.scrollLeft += shift;
    setScrollLeft(scrollLeft + shift);
    // Updates the latest scrolled position
    if (Math.floor(scroll.current.scrollWidth - scroll.current.scrollLeft) <= scroll.current.offsetWidth) {
      setScrollRight(true);
    } else {
      setScrollRight(false);
    }
  };

  /**
   * Checks scroll event and hides/shows the right arrow button
   */
  const checkScrollEnd = () => {
    setScrollLeft(scroll.current.scrollLeft);
    if (Math.floor(scroll.current.scrollWidth - scroll.current.scrollLeft) <= scroll.current.offsetWidth) {
      setScrollRight(true);
    } else {
      setScrollRight(false);
    }
  };

  /**
   * Renders Popover
   */
  return (
    <Root
      {...rest}
      open={open}
      anchorEl={anchorEl}
      className={classNames(classes.root, className)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      PaperProps={{id: id, onMouseEnter: onOpen, onMouseLeave: onClose, onTouchStart: onOpen}}>
      <ClickAwayListener onClickAway={onClose}>
        <Box component={'div'} className={classes.reactionsMenu}>
          {scrollLeft !== 0 && !isMobile && (
            <Icon onClick={() => slide(-50)} fontSize={'small'} className={classes.arrowIcon}>
              chevron_left
            </Icon>
          )}
          <List ref={scroll} onScroll={checkScrollEnd} className={classes.reactionsList}>
            {reactions.map((reaction: SCReactionType, index) => (
              <ListItem key={index} onClick={() => onReactionSelection(reaction)}>
                <Icon sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img alt={reaction.label} src={reaction.image} width={16} height={16} />
                </Icon>
              </ListItem>
            ))}
          </List>
          {!scrollRight && !isMobile && (
            <Icon onClick={() => slide(+50)} fontSize={'small'} className={classes.arrowIcon}>
              chevron_right
            </Icon>
          )}
        </Box>
      </ClickAwayListener>
    </Root>
  );
}
