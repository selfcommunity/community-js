import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import ChangePictureDialog from './ChangePictureDialog';
import {FormattedMessage} from 'react-intl';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

const PREFIX = 'SCChangePictureButton';

const CPButton = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function ChangePicture({iconButton, ...rest}: {iconButton: boolean; [p: string]: any}): JSX.Element {
  const [openChangePictureDialog, setOpenChangePictureDialog] = useState<boolean>(false);

  function handleCloseChangePictureDialog() {
    setOpenChangePictureDialog(false);
  }

  return (
    <React.Fragment>
      <CPButton
        size="small"
        variant="contained"
        onClick={() => setOpenChangePictureDialog(true)}
        style={iconButton ? {padding: 6, borderRadius: 50, minWidth: 'auto'} : {}}
        {...rest}>
        {iconButton ? (
          <PhotoCameraOutlinedIcon />
        ) : (
          <FormattedMessage id="ui.changePicture.button.change" defaultMessage="ui.changePicture.button.change" />
        )}
      </CPButton>
      {openChangePictureDialog && <ChangePictureDialog open={openChangePictureDialog} onClose={() => handleCloseChangePictureDialog()} />}
    </React.Fragment>
  );
}
