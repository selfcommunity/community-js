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
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DeleteAvatarDialog from './DeleteAvatarDialog';
import CentralProgress from '../../../shared/CentralProgress';

const PREFIX = 'SCChangePictureDialog';

const classes = {
  actions: `${PREFIX}-actions`,
  primary: `${PREFIX}-primary`
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
  },
  [`& .${classes.primary}`]: {
    border: 'solid'
  },
  '& .MuiCardHeader-title': {
    fontSize: '1.2rem'
  }
}));

function ChangePictureDialog({open, onClose}: {open: boolean; onClose?: () => void | undefined}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const [file, setFile] = useState(scUser.user['avatar']);
  const [primary, setPrimary] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let fileInput = useRef(null);
  const [openDeleteAvatarDialog, setOpenDeleteAvatarDialog] = useState<boolean>(false);

  function handleOpen() {
    setOpenDeleteAvatarDialog(true);
  }

  function handleClose() {
    setOpenDeleteAvatarDialog(false);
  }

  function handleDeleteSuccess(id) {
    setAvatars(avatars.filter((a) => a.id !== id));
    setPrimary(avatars[0].id);
  }

  function handleUpload(event) {
    fileInput = event.target.files[0];
    setFile(URL.createObjectURL(fileInput));
    handleSave();
  }

  function handleSave() {
    setIsLoading(true);
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
      .then((res: any) => {
        setIsLoading(false);
        setAvatars((prev) => [...prev, res.data]);
        setPrimary(res.data.id);
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
        setIsLoading(false);
        const primary = getPrimaryAvatar(res.data);
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

  function selectPrimaryAvatar(id) {
    http
      .request({
        url: Endpoints.SetPrimaryAvatar.url({id: scUser.user['id']}),
        method: Endpoints.SetPrimaryAvatar.method,
        data: {
          avatar_id: id
        }
      })
      .then(() => {
        setPrimary(id);
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
      {openDeleteAvatarDialog && (
        <DeleteAvatarDialog open={openDeleteAvatarDialog} onClose={handleClose} onSuccess={() => handleDeleteSuccess(primary)} id={primary} />
      )}
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
          {isLoading ? (
            <CentralProgress size={50} />
          ) : (
            <ImageList cols={3} rowHeight={'auto'}>
              {avatars.map((avatar) => (
                <ImageListItem
                  className={primary === avatar.id ? classes.primary : null}
                  key={avatar.id}
                  onClick={() => selectPrimaryAvatar(avatar.id)}>
                  <img src={avatar.avatar} loading="lazy" alt={'img'} />
                  <Button variant="outlined" onClick={() => handleOpen()}>
                    <FormattedMessage id="ui.changePicture.button.delete" defaultMessage="ui.changePicture.button.delete" />
                  </Button>
                </ImageListItem>
              ))}
            </ImageList>
          )}
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
