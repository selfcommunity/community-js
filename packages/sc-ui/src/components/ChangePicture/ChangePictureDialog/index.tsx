import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {CardHeader, CardMedia, Divider, IconButton, TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {Endpoints, http, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCChangePictureDialog';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 600,
  marginBottom: theme.spacing(2)
}));

function ChangePictureDialog({open, onClose}: {open: boolean; onClose?: () => void | undefined}): JSX.Element {
  const scUser: SCUserContextType = useContext(SCUserContext);
  const [user, setUser] = useState<SCUserType>(scUser.user);
  const [file, setFile] = useState(scUser.user['avatar']);
  const [blob, setBlob] = useState(null);
  let fileInput = useRef(null);

  function handleUpload(event) {
    fileInput = event.target.files[0];
    setBlob(fileInput);
    setFile(URL.createObjectURL(fileInput));
  }

  function handleSave() {
    const formData = new FormData();
    formData.append('avatar', blob);
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
        onClose();
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
        setFile(data.avatar);
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
          <CardMedia component="img" src={file} sx={{width: 151}} />
        </CardContent>
        <Divider />
        <CardActions disableSpacing sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button variant="contained" size="small" onClick={() => handleSave()}>
            <FormattedMessage id="ui.changePicture.button.finished" defaultMessage="ui.changePicture.button.finished" />
          </Button>
        </CardActions>
      </Root>
    </React.Fragment>
  );
}

export default ChangePictureDialog;
