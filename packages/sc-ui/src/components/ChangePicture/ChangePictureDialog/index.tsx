import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {CardHeader, Divider, IconButton, Box, Dialog, DialogTitle, DialogActions} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {Endpoints, http, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {FormattedMessage} from 'react-intl';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const PREFIX = 'SCChangePictureDialog';

const classes = {
  actions: `${PREFIX}-actions`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 800,
  marginBottom: theme.spacing(2),
  [`& .${classes.actions}`]: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

function ChangePictureDialog({open, onClose}: {open: boolean; onClose?: () => void | undefined}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const [file, setFile] = useState(scUser.user['avatar']);
  const [avatar, setAvatar] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [avatarId, setAvatarId] = useState<number>(null);
  let fileInput = useRef(null);
  const [openModal, setOpenModal] = React.useState(false);

  function handleOpen(id) {
    setOpenModal(true);
    setAvatarId(id);
  }

  function handleClose() {
    setOpenModal(false);
  }

  function handleUpload(event) {
    fileInput = event.target.files[0];
    setFile(URL.createObjectURL(fileInput));
    handleSave();
  }

  function handleSave() {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formData.append('avatar', fileInput);
    http
      .request({
        url: Endpoints.AddAvatar.url({id: scUser.user['id']}),
        method: Endpoints.AddAvatar.method,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then(() => {
        fetchUserAvatar();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserAvatar() {
    http
      .request({
        url: Endpoints.GetAvatars.url({id: scUser.user['id']}),
        method: Endpoints.GetAvatars.method
      })
      .then((res: any) => {
        const primary = getPrimaryAvatar(res.data);
        setAvatars(res.data.results);
        setAvatar(primary);
        setFile(primary.avatar);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getPrimaryAvatar(data) {
    return data.results.find((a) => a.primary === true);
  }

  function deleteAvatar() {
    http
      .request({
        url: Endpoints.RemoveAvatar.url({id: scUser.user['id']}),
        method: Endpoints.RemoveAvatar.method,
        data: {
          avatar_id: avatarId
        }
      })
      .then(() => {
        handleClose();
        fetchUserAvatar();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <React.Fragment>
      <Dialog open={openModal} onClose={() => handleClose()}>
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
      <Root>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          title={<FormattedMessage id="ui.changePicture.title" defaultMessage="ui.changePicture.title" />}
        />
        <Divider />
        <CardContent>
          <React.Fragment>
            <input type="file" onChange={() => handleUpload(event)} ref={fileInput} hidden />
            <Button variant="outlined" onClick={() => fileInput.current.click()}>
              <FolderOpenIcon fontSize="small" />
              <FormattedMessage id="ui.changePicture.button.upload" defaultMessage="ui.changePicture.button.upload" />
            </Button>
          </React.Fragment>
          <Typography sx={{fontSize: 10}} color="text.secondary" gutterBottom>
            <FormattedMessage id="ui.changePicture.listF" defaultMessage="ui.changePicture.listF" /> <br />
            <FormattedMessage id="ui.changePicture.listS" defaultMessage="ui.changePicture.listS" />
          </Typography>
          <ImageList cols={3} rowHeight={'auto'}>
            {avatars.map((avatar) => (
              <ImageListItem key={avatar.id}>
                <img src={avatar.avatar} loading="lazy" alt={'img'} />
                <Button variant="outlined" onClick={() => handleOpen(avatar.id)}>
                  <FormattedMessage id="ui.changePicture.button.delete" defaultMessage="ui.changePicture.button.delete" />
                </Button>
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
        <Divider />
        <CardActions disableSpacing className={classes.actions}>
          <Button variant="contained" size="small" onClick={onClose}>
            <FormattedMessage id="ui.changePicture.button.finished" defaultMessage="ui.changePicture.button.finished" />
          </Button>
        </CardActions>
      </Root>
    </React.Fragment>
  );
}

export default ChangePictureDialog;
