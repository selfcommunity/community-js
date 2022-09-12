import React, {useContext, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Box, IconButton, ImageListItemBar} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Endpoints, UserService} from '@selfcommunity/api-services';
import {SCContext, SCContextType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import BaseDialog from '../../../shared/BaseDialog';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCChangePictureDialog';

const classes = {
  root: `${PREFIX}-root`,
  actions: `${PREFIX}-actions`,
  upload: `${PREFIX}-upload`,
  imageItem: `${PREFIX}-imageItem`
};

const Root = styled(Box, {
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
  const scContext: SCContextType = useContext(SCContext);

  //STATE
  const [file, setFile] = useState(scUserContext.user['avatar']);
  const [error, setError] = useState<boolean>(false);
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
    setFile(URL.createObjectURL(fileInput as any));
    handleSave();
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
        setError(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        console.log(error);
      });
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
          console.log(error);
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
        console.log(error);
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
        console.log(error);
      });
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
