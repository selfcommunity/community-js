import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Box, Card, IconButton, ImageListItemBar} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Endpoints, http, SCUserContext, SCUserContextType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import BaseDialog from '../../../shared/BaseDialog';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCChangePictureDialog';

const classes = {
  root: `${PREFIX}-root`,
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

export interface CPDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * On change function.
   * @default null
   */
  onChange?: (avatar) => void;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ChangePictureDialog(inProps: CPDialogProps): JSX.Element {
  //PROPS
  const props: CPDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {open, onChange, onClose, className, ...rest} = props;
  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //STATE
  const [file, setFile] = useState(scUserContext.user['avatar']);
  const [primary, setPrimary] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [deleteAvatarId, setDeleteAvatarId] = useState<number>(null);
  let fileInput = useRef(null);
  const [openDeleteAvatarDialog, setOpenDeleteAvatarDialog] = useState<boolean>(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  /**
   * Handles open confirm delete avatar dialog
   * @param id
   */
  function handleOpen(id) {
    setOpenDeleteAvatarDialog(true);
    setDeleteAvatarId(id);
  }

  /**
   * Handles avatar upload
   * @param event
   */
  function handleUpload(event) {
    fileInput = event.target.files[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    setFile(URL.createObjectURL(fileInput));
    handleSave();
  }

  /**
   * Performs save avatar after upload
   */
  function handleSave() {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Fetches the list of scUser's avatars
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
   * Gets the primary avatar from a list of avatars
   * @param data
   */
  function getPrimaryAvatar(data) {
    return data.results.find((a) => a.primary === true);
  }

  /**
   * Selects primary avatar
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
          scUserContext.updateUser({avatar: avatar.avatar});
          setPrimary(avatar.id);
          onChange && onChange(avatar);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  /**
   * Handles deletion of a specific avatar
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

  /**
   * On mount, fetches the list of scUser's avatars
   */
  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
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
          <Button disabled={loading} variant="outlined" onClick={() => fileInput.current.click()}>
            {loading ? (
              <React.Fragment>
                <CircularProgress size={15} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Icon fontSize="small">folder_open</Icon>
                <FormattedMessage id="ui.changePicture.button.upload" defaultMessage="ui.changePicture.button.upload" />
              </React.Fragment>
            )}
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
                      <Icon>delete</Icon>
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
