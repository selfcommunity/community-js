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
import BaseDialog from '../../../shared/BaseDialog';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';

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

export default function ChangePictureDialog({
  open = false,
  onChange = null,
  onClose = null,
  ...rest
}: {
  open: boolean;
  onChange?: (avatar) => void;
  onClose?: () => void;
  [p: string]: any;
}): JSX.Element {
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const [file, setFile] = useState(scUserContext.user['avatar']);
  const [primary, setPrimary] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [deleteAvatarId, setDeleteAvatarId] = useState<number>(null);
  let fileInput = useRef(null);
  const [openDeleteAvatarDialog, setOpenDeleteAvatarDialog] = useState<boolean>(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState<boolean>(false);
  const handleClose = () => {
    setOpenDeleteAvatarDialog(false);
  };

  /**
   * Handle open confirm delete avatar dialog
   * @param id
   */
  function handleOpen(id) {
    setOpenDeleteAvatarDialog(true);
    setDeleteAvatarId(id);
  }

  /**
   * Handle upload
   * @param event
   */
  function handleUpload(event) {
    fileInput = event.target.files[0];
    setFile(URL.createObjectURL(fileInput));
    handleSave();
  }

  /**
   * Perform save avatar uploaded
   */
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
        selectPrimaryAvatar(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Fetch the list of avatars of scUser
   */
  function fetchUserAvatar() {
    http
      .request({
        url: Endpoints.GetAvatars.url({id: scUserContext.user['id']}),
        method: Endpoints.GetAvatars.method
      })
      .then((res: any) => {
        const primary = getPrimaryAvatar(res.data);
        if (res.data && res.data.results.length) {
          setAvatars(res.data.results);
          setPrimary(primary.id);
          setFile(primary.avatar);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Get the primary avatar from a list of avatars
   * @param data
   */
  function getPrimaryAvatar(data) {
    return data.results.find((a) => a.primary === true);
  }

  /**
   * Select primary avatar
   * Only if another avatar is selected (primary !== avatar.id)
   * @param avatar
   */
  function selectPrimaryAvatar(avatar) {
    if (avatar.id !== primary) {
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
          onChange && onChange(avatar);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  /**
   * Handle delete a specific avatar
   * @param id
   */
  function deleteAvatar() {
    setIsDeletingAvatar(true);
    http
      .request({
        url: Endpoints.RemoveAvatar.url({id: scUserContext.user['id']}),
        method: Endpoints.RemoveAvatar.method,
        data: {
          avatar_id: deleteAvatarId
        }
      })
      .then(() => {
        const _avatars = avatars.filter((a) => a.id !== deleteAvatarId);
        setAvatars(_avatars);
        setIsDeletingAvatar(false);
        setOpenDeleteAvatarDialog(false);
        if (primary === deleteAvatarId) {
          if (_avatars.length > 0) {
            selectPrimaryAvatar(_avatars[_avatars.length - 1]);
          }
        }
      })
      .catch((error) => {
        setOpenDeleteAvatarDialog(false);
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <Root {...rest}>
      {openDeleteAvatarDialog && (
        <ConfirmDialog
          open={openDeleteAvatarDialog}
          title={<FormattedMessage id="ui.changePicture.dialog.msg" defaultMessage="ui.changePicture.dialog.msg" />}
          btnConfirm={<FormattedMessage id="ui.changePicture.dialog.confirm" defaultMessage="ui.changePicture.dialog.confirm" />}
          onConfirm={deleteAvatar}
          isUpdating={isDeletingAvatar}
          onClose={() => setOpenDeleteAvatarDialog(false)}
        />
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
