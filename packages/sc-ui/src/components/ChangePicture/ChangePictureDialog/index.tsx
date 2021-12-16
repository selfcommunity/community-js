import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Box, IconButton, ImageListItemBar} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DeleteAvatarDialog from './DeleteAvatarDialog';
import BaseDialog from '../../../shared/BaseDialog';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const PREFIX = 'SCChangePictureDialog';

const classes = {
  actions: `${PREFIX}-actions`,
  upload: `${PREFIX}-upload`,
  imageItem: `${PREFIX}-imageItem`
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

function ChangePictureDialog({open, onClose, ...props}: {open: boolean; onClose?: () => void | undefined}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const [file, setFile] = useState(scUserContext.user['avatar']);
  const [primary, setPrimary] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [avatarId, setAvatarId] = useState<number>(null);
  let fileInput = useRef(null);
  const [openDeleteAvatarDialog, setOpenDeleteAvatarDialog] = useState<boolean>(false);
  const handleClose = () => {
    setOpenDeleteAvatarDialog(false);
  };

  function handleDeleteSuccess(id) {
    setAvatars(avatars.filter((a) => a.id !== id));
    if (avatars.length > 0) {
      scUserContext.setAvatar(avatars[avatars.length - 1].avatar);
    }
  }

  function handleOpen(id) {
    setOpenDeleteAvatarDialog(true);
    setAvatarId(id);
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
        url: Endpoints.AddAvatar.url({id: scUserContext.user['id']}),
        method: Endpoints.AddAvatar.method,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then((res) => {
        setAvatars((prev) => [...prev, res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserAvatar() {
    http
      .request({
        url: Endpoints.GetAvatars.url({id: scUserContext.user['id']}),
        method: Endpoints.GetAvatars.method
      })
      .then((res: any) => {
        const primary = getPrimaryAvatar(res.data);
        console.log(primary);
        setAvatars(res.data.results);
        setPrimary(primary.id);
        setFile(primary.avatar);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getPrimaryAvatar(data) {
    return data.results.find((a) => a.primary === true);
  }

  function selectPrimaryAvatar(avatar) {
    http
      .request({
        url: Endpoints.SetPrimaryAvatar.url({id: scUserContext.user['id']}),
        method: Endpoints.SetPrimaryAvatar.method,
        data: {
          avatar_id: avatar.id
        }
      })
      .then(() => {
        scUserContext.setAvatar(avatar.avatar);
        setPrimary(avatar.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <Root {...props}>
      {openDeleteAvatarDialog && (
        <DeleteAvatarDialog open={openDeleteAvatarDialog} onClose={handleClose} onSuccess={() => handleDeleteSuccess(avatarId)} id={avatarId} />
      )}
      <BaseDialog title={<FormattedMessage defaultMessage="ui.changePicture.title" id="ui.changePicture.title" />} onClose={onClose} open={open}>
        <Box className={classes.upload}>
          <input type="file" onChange={() => handleUpload(event)} ref={fileInput} hidden />
          <Button variant="outlined" onClick={() => fileInput.current.click()}>
            <FolderOpenIcon fontSize="small" />
            <FormattedMessage id="ui.changePicture.button.upload" defaultMessage="ui.changePicture.button.upload" />
          </Button>
          <Typography sx={{fontSize: 10}} color="text.secondary" gutterBottom>
            <FormattedMessage id="ui.changePicture.listF" defaultMessage="ui.changePicture.listF" /> <br />
            <FormattedMessage id="ui.changePicture.listS" defaultMessage="ui.changePicture.listS" />
          </Typography>
        </Box>
        <ImageList cols={3} rowHeight={'auto'}>
          {avatars.map((avatar) => (
            <Box className={classes.imageItem} key={avatar.id}>
              <ImageListItem key={avatar.id} onClick={() => selectPrimaryAvatar(avatar)} sx={{border: primary === avatar.id ? 'solid' : null}}>
                <img src={avatar.avatar} loading="lazy" alt={'img'} />
                <ImageListItemBar
                  position="top"
                  actionIcon={
                    <IconButton onClick={() => handleOpen(avatar.id)} size="small" sx={{color: 'rgba(255, 255, 255, 0.54)'}}>
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            </Box>
          ))}
        </ImageList>
      </BaseDialog>
    </Root>
  );
}

export default ChangePictureDialog;
