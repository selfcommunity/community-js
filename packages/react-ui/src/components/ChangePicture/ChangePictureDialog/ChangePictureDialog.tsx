import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Alert, Box, IconButton, ImageList, ImageListItem, ImageListItemBar} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Endpoints, UserService} from '@selfcommunity/api-services';
import {SCContext, SCContextType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../../shared/BaseDialog';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import {useThemeProps} from '@mui/system';
import {scroll} from 'seamless-scroll-polyfill';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {PREFIX} from '../constants';

const classes = {
  dialogRoot: `${PREFIX}-dialog-root`,
  upload: `${PREFIX}-upload`,
  imagesList: `${PREFIX}-images-list`,
  imageItem: `${PREFIX}-image-item`,
  primary: `${PREFIX}-primary`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot'
})(() => ({}));

export interface CPDialogProps extends BaseDialogProps {
  /**
   * On change function.
   * @default null
   */
  onChange?: (avatar) => void;
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
  const scContext: SCContextType = useContext(SCContext);

  //STATE
  const [file, setFile] = useState(scUserContext.user['avatar']);
  const [error, setError] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
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
    const maxSize = 3 * 1024 * 1024;
    if (event && event.target.files[0]?.size <= maxSize) {
      fileInput = event.target.files[0];
      setFile(URL.createObjectURL(fileInput as any));
      handleSave();
    } else {
      setAlert(true);
    }
  }

  /**
   * Performs save avatar after upload
   */
  function handleSave() {
    setLoading(true);
    const formData: any = new FormData();
    formData.append('avatar', fileInput);
    UserService.addUserAvatar(formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data) => {
        setAvatars((prev) => [...prev, data]);
        selectPrimaryAvatar(data);
        setLoading(false);
        scrollToEndListAvatars();
        setError(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Handle scroll to the last item added in the list of avatars
   */
  function scrollToEndListAvatars() {
    setTimeout(() => {
      const element = document.getElementById(`avatarsList`);
      if (element) {
        scroll(element, {top: element.scrollHeight, behavior: 'smooth'});
      }
    }, 200);
  }

  /**
   * Fetches the list of avatars
   */
  const fetchUserAvatars = async (next: string = Endpoints.GetAvatars.url({})): Promise<[]> => {
    const data: any = await UserService.getUserAvatars({url: next});
    return data.next ? data.results.concat(await fetchUserAvatars(data.next)) : data.results;
  };

  /**
   * Gets the primary avatar from a list of avatars
   * @param data
   */
  function getPrimaryAvatar(data) {
    return data.find((a) => a.primary === true);
  }

  /**
   * Selects primary avatar
   * Only if another avatar is selected (primary !== avatar.id)
   * @param avatar
   */
  function selectPrimaryAvatar(avatar) {
    if (avatar.id !== primary) {
      UserService.setUserPrimaryAvatar(avatar.id, {headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`}})
        .then(() => {
          scUserContext.updateUser({avatar: avatar.avatar});
          setPrimary(avatar.id);
          onChange && onChange(avatar);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Handles deletion of a specific avatar
   */
  function deleteAvatar() {
    setIsDeletingAvatar(true);
    UserService.removeUserAvatar(deleteAvatarId, {headers: {Authorization: `Bearer ${scContext.settings.session.authToken.accessToken}`}})
      .then(() => {
        const _avatars = avatars.filter((a) => a.id !== deleteAvatarId);
        setAvatars(_avatars);
        setIsDeletingAvatar(false);
        setOpenDeleteAvatarDialog(false);
        if (primary === deleteAvatarId) {
          if (_avatars.length > 0) {
            selectPrimaryAvatar(_avatars[_avatars.length - 1]);
          } else {
            // if there are no more avatars set auto generated image
            onChange && onChange(null);
          }
        }
      })
      .catch((error) => {
        setOpenDeleteAvatarDialog(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * On mount, fetches the list of scUser's avatars
   */
  useEffect(() => {
    fetchUserAvatars()
      .then((data: any) => {
        const primary = getPrimaryAvatar(data);
        if (data && data.length) {
          setAvatars(data);
          setPrimary(primary.id);
          setFile(primary.avatar);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, []);

  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(classes.dialogRoot, className)}
      title={<FormattedMessage defaultMessage="ui.changePicture.title" id="ui.changePicture.title" />}
      onClose={onClose}
      open={open}
      {...rest}>
      <Box className={classes.upload}>
        {alert ? (
          <Alert color="error" onClose={() => setAlert(false)}>
            <FormattedMessage id="ui.changePicture.button.upload.alert" defaultMessage="ui.changePicture.button.upload.alert" />
          </Alert>
        ) : (
          <>
            <input type="file" onChange={handleUpload} ref={fileInput} hidden accept=".gif,.png,.jpg,.jpeg" />
            <Button
              disabled={loading || isDeletingAvatar}
              variant="outlined"
              onClick={() => fileInput.current.click()}
              color={error ? 'error' : 'primary'}
              startIcon={loading ? null : <Icon fontSize="small">folder_open</Icon>}>
              {loading ? (
                <CircularProgress size={15} />
              ) : (
                <>
                  {error ? (
                    <FormattedMessage id="ui.changePicture.button.upload.error" defaultMessage="ui.changePicture.button.upload.error" />
                  ) : (
                    <FormattedMessage id="ui.changePicture.button.upload" defaultMessage="ui.changePicture.button.upload" />
                  )}
                </>
              )}
            </Button>
          </>
        )}
        <Typography component="span" fontSize="small" color="text.secondary" gutterBottom>
          <FormattedMessage
            id="ui.changePicture.info"
            defaultMessage="ui.changePicture.info"
            values={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              li: (chunks) => <li>{chunks}</li>,
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              ul: (chunks) => <ul>{chunks}</ul>
            }}
          />
        </Typography>
      </Box>
      <ImageList cols={3} rowHeight={'auto'} id="avatarsList" classes={{root: classes.imagesList}}>
        {avatars.map((avatar) => (
          <Box className={classes.imageItem} key={avatar.id}>
            <ImageListItem className={primary === avatar.id ? classes.primary : ''} key={avatar.id} onClick={() => selectPrimaryAvatar(avatar)}>
              <img src={avatar.avatar} loading="lazy" alt={'img'} />
              <ImageListItemBar
                position="top"
                actionIcon={
                  <IconButton onClick={() => handleOpen(avatar.id)} size="small">
                    <Icon>delete</Icon>
                  </IconButton>
                }
              />
            </ImageListItem>
          </Box>
        ))}
      </ImageList>
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
    </Root>
  );
}
