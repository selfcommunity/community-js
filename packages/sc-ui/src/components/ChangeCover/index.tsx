import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Menu, MenuItem, ListItemIcon, Typography, Button, Popover, Divider, Grid, IconButton, Box} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCChangeCoverButton';

const classes = {
  helpPopover: `${PREFIX}-help-popover`
};

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap'
}));

export default function ChangeCover({onClick, ...rest}: {onClick?: () => void | undefined; [p: string]: any}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  let fileInput = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorElPopover, setAnchorElPopover] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const hasCover = scUserContext.user.cover !== null;

  const handleClickHelpButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPopover(event.currentTarget);
  };
  const handleCloseHelpPopover = () => {
    setAnchorElPopover(null);
  };
  const isOpen = Boolean(anchorElPopover);

  function handleUpload(event) {
    fileInput = event.target.files[0];
    handleSave();
  }

  function handleSave() {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formData.append('cover', fileInput);
    http
      .request({
        url: Endpoints.UpdateUser.url({id: scUserContext.user['id']}),
        method: Endpoints.UpdateUser.method,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then((res: AxiosResponse<SCUserType>) => {
        scUserContext.setCover(res.data.cover);
        setAnchorEl(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Root>
      <Button size="small" variant="contained" onClick={handleClick} {...rest}>
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
      <IconButton color="primary" aria-label="upload picture" component="span" onClick={handleClickHelpButton}>
        <HelpOutlineOutlinedIcon />
      </IconButton>
      {isOpen && (
        <Popover
          open={isOpen}
          anchorEl={anchorElPopover}
          onClose={handleCloseHelpPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}>
          <Box sx={{p: '10px'}}>
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
          </Box>
        </Popover>
      )}
    </Root>
  );
}
