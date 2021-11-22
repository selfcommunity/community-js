import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TagOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TagChip from '../TagChip';
import {SCTagType} from '@selfcommunity/core';
import {Box, Divider, Stack, Typography} from '@mui/material';

const PREFIX = 'SCTags';

const TagsPopperRoot = styled(Box, {
  name: `${PREFIX}`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  cursor: 'pointer'
}));

/**
 * Custom Popper
 */
const classes = {
  paper: `${PREFIX}-paper`
};

const TagsPopper = styled(Popper, {
  name: `${PREFIX}Popper`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  zIndex: 2,
  [`& .${classes.paper}`]: {
    padding: '10px 5px'
  }
}));

/**
 * Custom StackList and ItemList
 */
const ListRoot = styled(Stack, {
  name: `${PREFIX}List`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})();

const StackList = styled(Stack, {
  name: `${PREFIX}Stack`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})();

const ItemList = styled(Box, {
  name: `${PREFIX}ItemList`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0.2),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

export enum TagsComponentType {
  LIST = 'list',
  POPPER = 'popper'
}

export default function Tags({
  tags = [],
  title = null,
  type = TagsComponentType.POPPER,
  onOpen = null,
  onClose = null,
  onClickTag = null,
  ...rest
}: {
  tags?: SCTagType[];
  title?: string;
  onOpen?: (res: any) => void;
  onClose?: (res: any) => void;
  onClickTag?: (res: any) => void;
  type?: TagsComponentType;
  [p: string]: any;
}): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  let popperRef = useRef(null);

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
    if (rest.onOpen) {
      rest.onOpen(!open);
    }
  }

  function handleClose() {
    if (popperRef.current && popperRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    if (rest.onClose) {
      rest.onClose();
    }
  }

  function renderTitle() {
    return (
      <>
        {title && (
          <>
            <Typography sx={{padding: 1, fontWeight: 600}}>{title}</Typography>
            <Divider />
          </>
        )}
      </>
    );
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      popperRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      {tags.length && (
        <React.Fragment>
          {type === TagsComponentType.POPPER ? (
            <TagsPopperRoot {...rest}>
              <TagOutlinedIcon ref={popperRef} fontSize="small" onClick={handleToggle} aria-haspopup="true" />
              <TagsPopper
                open={open}
                anchorEl={popperRef.current}
                transition
                placement="bottom-start"
                modifiers={[
                  {
                    name: 'preventOverflow',
                    enabled: true
                  }
                ]}>
                {({TransitionProps, placement}) => (
                  <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
                    <Paper variant={'outlined'} className={classes.paper}>
                      <ClickAwayListener onClickAway={handleClose}>
                        <>
                          {renderTitle()}
                          <StackList spacing={2} {...rest}>
                            {tags.map((tag) => (
                              <ItemList key={tag.id}>
                                <TagChip tag={tag} onClick={onClickTag} />
                              </ItemList>
                            ))}
                          </StackList>
                        </>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </TagsPopper>
            </TagsPopperRoot>
          ) : (
            <ListRoot>
              {renderTitle()}
              <StackList spacing={2} direction={rest.direction ? rest.direction : 'column'}>
                {tags.map((tag) => (
                  <ItemList key={tag.id}>
                    <TagChip tag={tag} onClick={onClickTag} />
                  </ItemList>
                ))}
              </StackList>
            </ListRoot>
          )}
        </React.Fragment>
      )}
    </>
  );
}
