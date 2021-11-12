import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import ChangePictureDialog from './ChangePictureDialog';

const PREFIX = 'SCChangePictureButton';

const CPButton = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

function ChangePicture({onClick}: {onClick?: () => void | undefined}): JSX.Element {
  const [openChangePictureDialog, setOpenChangePictureDialog] = useState<boolean>(false);

  function handleCloseChangePictureDialog() {
    setOpenChangePictureDialog(false);
  }

  return (
    <React.Fragment>
      <CPButton size="small" variant="outlined" onClick={() => setOpenChangePictureDialog(true)}>
        Change Picture
      </CPButton>
      {openChangePictureDialog && <ChangePictureDialog open={openChangePictureDialog} onClose={() => handleCloseChangePictureDialog()} />}
    </React.Fragment>
  );
}

export default ChangePicture;
