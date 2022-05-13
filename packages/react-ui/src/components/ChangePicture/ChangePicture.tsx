import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import ChangePictureDialog from './ChangePictureDialog/ChangePictureDialog';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCChangePictureButton';

const classes = {
  root: `${PREFIX}-root`
};

const CPButton = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ChangePictureProps {
  /**
   * On change function.
   * @default null
   */
  onChange?: (avatar) => void;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  iconButton: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Change Picture component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ChangePicture} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCChangePictureButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCChangePictureButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ChangePicture(inProps: ChangePictureProps): JSX.Element {
  //PROPS
  const props: ChangePictureProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {iconButton, onChange, autoHide, className, ...rest} = props;

  //STATE
  const [openChangePictureDialog, setOpenChangePictureDialog] = useState<boolean>(false);

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // Anonymous
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <React.Fragment>
        <CPButton
          className={classNames(classes.root, className)}
          size="small"
          variant="contained"
          onClick={() => setOpenChangePictureDialog(true)}
          style={iconButton ? {padding: 6, borderRadius: 50, minWidth: 'auto'} : {}}
          {...rest}>
          {iconButton ? (
            <Icon>photo_camera</Icon>
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
