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

export interface ChangePictureProps {
  /**
   * On change function.
   * @default void
   */
  onChange?: (avatar) => void;
  /**
   * Hides category component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   * @default null
   */
  iconButton: boolean;
}
export default function ChangePicture(props: ChangePictureProps): JSX.Element {
  //PROPS
  const {iconButton, onChange, autoHide, className, ...rest} = props;

  //STATE
  const [openChangePictureDialog, setOpenChangePictureDialog] = useState<boolean>(false);

  /**
   * Renders change picture (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <React.Fragment>
        <CPButton
          className={className}
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
        {openChangePictureDialog && (
          <ChangePictureDialog
            open={openChangePictureDialog}
            onChange={(avatar) => onChange && onChange(avatar)}
            onClose={() => setOpenChangePictureDialog(false)}
          />
        )}
      </React.Fragment>
    );
  }
  return null;
}
