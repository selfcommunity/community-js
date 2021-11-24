import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Menu, MenuItem, ListItemIcon, Typography, Button, Popover, Divider, Grid} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCChangeCoverButton';

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap'
}));

function ChangeCover({onClick}: {onClick?: () => void | undefined}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const [user, setUser] = useState<SCUserType>(scUser.user);
  let fileInput = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const hasCover = user.cover !== null;

  function handleUpload(event) {
    fileInput = event.target.files[0];
    handleSave();
  }

  function handleSave() {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formData.append('cover', fileInput);
    console.log(fileInput);
    http
      .request({
        url: Endpoints.UpdateUser.url({id: scUser.user['id']}),
        method: Endpoints.UpdateUser.method,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then((res: AxiosResponse<SCUserType>) => {
        setUser(res.data);
        setAnchorEl(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUser() {
    http
      .request({
        url: Endpoints.User.url({id: scUser.user['id']}),
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
    fetchUser();
  }, []);

  return (
    <React.Fragment>
      <Root>
        <Button variant="outlined" onClick={handleClick} size="small" sx={{ml: 2}}>
          <FormattedMessage id="ui.changeCover.button.change" defaultMessage="ui.changeCover.button.change" />
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {hasCover && (
            <MenuItem>
              <ListItemIcon>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <FormattedMessage id="ui.changeCover.button.delete" defaultMessage="ui.changeCover.button.delete" />
            </MenuItem>
          )}
          <input type="file" onChange={() => handleUpload(event)} ref={fileInput} hidden />
          <MenuItem onClick={() => fileInput.current.click()}>
            <ListItemIcon>
              <AddCircleOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <FormattedMessage id="ui.changeCover.button.upload" defaultMessage="ui.changeCover.button.upload" />
          </MenuItem>
        </Menu>
        <HelpOutlineOutlinedIcon onClick={() => setIsOpen(true)} sx={{ml: 1}} />
        {isOpen && (
          <Popover
            open={isOpen}
            onClose={() => setIsOpen(false)}
            anchorReference="anchorPosition"
            anchorPosition={{top: 220, left: 520}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            sx={{
              width: '800px',
              height: '200px'
            }}>
            <Typography component="h3">
              <FormattedMessage id="ui.changeCover.button.uploadA" defaultMessage="ui.changeCover.button.uploadA" />
            </Typography>
            <Divider />
            <Typography component="span">
              <ul className="list">
                <li>
                  <FormattedMessage id="ui.changeCover.listF" defaultMessage="ui.changeCover.listF" />
                </li>
                <li>
                  <FormattedMessage id="ui.changeCover.listD" defaultMessage="ui.changeCover.listF" />
                </li>
                <li>
                  <FormattedMessage id="ui.changeCover.listW" defaultMessage="ui.changeCover.listF" />
                </li>
              </ul>
            </Typography>
          </Popover>
        )}
      </Root>
    </React.Fragment>
  );
}

export default ChangeCover;
