import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import ChangePictureDialog from './ChangePictureDialog/ChangePictureDialog';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  dialog: `${PREFIX}-dialog`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

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
 *
 *
 * This component renders a button that allows users to manage their profile pictures.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/ChangePicture)

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
 |root|.SCChangePictureButton-dialog|Styles applied to the dialog element.|

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
      <>
        <Root
          className={classNames(classes.root, className)}
          size="small"
          variant="contained"
          onClick={() => setOpenChangePictureDialog(true)}
          {...rest}>
          {iconButton ? (
            <Icon>photo_camera</Icon>
          ) : (
            <FormattedMessage id="ui.changePicture.button.change" defaultMessage="ui.changePicture.button.change" />
          )}
        </Root>
        {openChangePictureDialog && (
          <ChangePictureDialog
            className={classes.dialog}
            open={openChangePictureDialog}
            onChange={(avatar) => onChange && onChange(avatar)}
            onClose={() => setOpenChangePictureDialog(false)}
          />
        )}
      </>
    );
  }
  return null;
}
