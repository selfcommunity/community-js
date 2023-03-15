import React, {useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {Box, Divider, Stack, Typography} from '@mui/material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Icon from '@mui/material/Icon';
import TagChip, {TagChipProps} from '../TagChip';
import {SCTagType} from '@selfcommunity/types';

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
})({});

const StackList = styled(Stack, {
  name: `${PREFIX}Stack`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  '& > div:not(style)+:not(style)': {
    margin: 0
  }
});

const ItemList = styled(Box, {
  name: `${PREFIX}ItemList`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(0.2),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

export enum TagsComponentType {
  LIST = 'list',
  POPPER = 'popper'
}
export interface TagsProps {
  /**
   * Tags
   * @default []
   */
  tags?: SCTagType[];

  /**
   * Tag title
   * @default null
   */
  title?: string;

  /**
   * Handles component opening
   * @default null
   */
  onOpen?: (res: any) => void;

  /**
   * Handles component closing
   * @default null
   */
  onClose?: (res: any) => void;

  /**
   * Handles on tag clicking
   * @default null
   */
  onClickTag?: (res: any) => void;

  /**
   * Props to spread change picture button
   * @default {}
   */
  TagChipProps?: Pick<TagChipProps, Exclude<keyof TagChipProps, 'tag'>>;

  /**
   * Tag component type
   * @default 'popper'
   */
  type?: TagsComponentType;

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Tags(props: TagsProps): JSX.Element {
  // PROPS
  const {
    tags = [],
    title = null,
    type = TagsComponentType.POPPER,
    onOpen = null,
    onClose = null,
    onClickTag = null,
    TagChipProps = {},
    ...rest
  } = props;

  // STATE
  const [open, setOpen] = useState<boolean>(false);
  let popperRef = useRef(null);

  // HANDLERS
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

  /**
   * Renders tag title
   */
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

  /**
   * Returns focus to the button when we transitioned from !open -> open
   */
  const prevOpen = useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      popperRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  /**
   * Renders component
   */
  return (
    <>
      {tags.length && (
        <React.Fragment>
          {type === TagsComponentType.POPPER ? (
            <TagsPopperRoot {...rest}>
              <Icon ref={popperRef} fontSize="small" onClick={handleToggle} aria-haspopup="true">
                label
              </Icon>
              {/* @ts-ignore */}
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
                {({TransitionProps, placement, ...rest}) => (
                  <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
                    <Paper variant={'outlined'} className={classes.paper}>
                      <ClickAwayListener onClickAway={handleClose}>
                        <>
                          {renderTitle()}
                          <StackList spacing={2} {...rest}>
                            {tags.map((tag) => (
                              <ItemList key={tag.id}>
                                <TagChip tag={tag} onClick={onClickTag} {...TagChipProps} />
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
              <StackList spacing={1} direction={rest.direction ? rest.direction : 'column'}>
                {tags.map((tag) => (
                  <ItemList key={tag.id}>
                    <TagChip tag={tag} onClick={onClickTag} {...TagChipProps} />
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
