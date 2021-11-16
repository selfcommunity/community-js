import React, {useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import WorldIcon from '@mui/icons-material/Public';
import TagChip from '../../components/TagChip';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCUserTags';

const classes = {
  paper: `${PREFIX}-paper`
};

const TagsPopper = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  zIndex: 2,
  [`& .${classes.paper}`]: {
    maxWidth: 260,
    padding: '10px 5px'
  }
}));

export default function UserTags({
  open = false,
  scUserId = null,
  scUser = null,
  onClick = null,
  ellipsed = true,
  ...rest
}: {
  open?: boolean;
  scUserId?: number;
  scUser?: SCUserType;
  onClick?: (res: any) => void;
  ellipsed?: boolean;
  [p: string]: any;
}): JSX.Element {
  const [_open, setOpen] = useState<boolean>(open);
  const [user, setUser] = useState<SCUserType>(scUser);
  const ref = useRef();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  /**
   * If scUser not in props, attempt to get the tag by scUserId (in props) if exist
   */
  function fetchUser() {
    http
      .request({
        url: Endpoints.User.url({id: scUserId}),
        method: Endpoints.User.method
      })
      .then((res: AxiosResponse<SCUserType>) => {
        const data: SCUserType = res.data;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!user && scUserId !== null) {
      fetchUser();
    }
  }, []);

  if (!user) {
    return <></>;
  }

  return (
    <React.Fragment>
      {user.tags && user.tags.length ? (
        <React.Fragment>
          <BookOutlinedIcon
            fontSize="small"
            onClick={this.handleOpen}
            ref={(ref) => {
              this.ref.current = ref;
            }}
            aria-owns={open ? `reporting-menu-${user.id}` : undefined}
            aria-haspopup="true"
          />
          <TagsPopper
            open={open}
            anchorEl={this.ref.current}
            role={undefined}
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
                    <MenuList>
                      {user.tags.map((tag) => (
                        <MenuItem key={tag.id}>
                          <TagChip scTag={tag} />
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </TagsPopper>
        </React.Fragment>
      ) : (
        <WorldIcon color="disabled" fontSize="small" />
      )}
    </React.Fragment>
  );
}
