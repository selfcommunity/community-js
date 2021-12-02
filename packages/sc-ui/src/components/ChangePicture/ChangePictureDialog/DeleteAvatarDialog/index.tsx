import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Dialog, DialogTitle, DialogActions} from '@mui/material';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCDeleteAvatarDialog';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 800,
  marginBottom: theme.spacing(2)
}));

function DeleteAvatarDialog({id, open, onClose}: {id?: number; open: boolean; onClose?: () => void | undefined}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);

  function handleClose() {
    onClose();
  }

  function deleteAvatar() {
    http
      .request({
        url: Endpoints.RemoveAvatar.url({id: scUser.user['id']}),
        method: Endpoints.RemoveAvatar.method,
        data: {
          avatar_id: id
        }
      })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <React.Fragment>
      <Root>
        <Dialog open={open} onClose={() => handleClose()}>
          <DialogTitle>
            <FormattedMessage id="ui.changePicture.dialog.msg" defaultMessage="ui.changePicture.dialog.msg" />
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => handleClose()}>
              <FormattedMessage id="ui.changePicture.dialog.close" defaultMessage="ui.changePicture.dialog.close" />
            </Button>
            <Button onClick={() => deleteAvatar()} autoFocus>
              <FormattedMessage id="ui.changePicture.dialog.confirm" defaultMessage="ui.changePicture.dialog.confirm" />
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </React.Fragment>
  );
}

export default DeleteAvatarDialog;
