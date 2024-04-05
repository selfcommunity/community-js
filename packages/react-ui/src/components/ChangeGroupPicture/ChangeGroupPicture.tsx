import React, {useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Alert} from '@mui/material';
import Icon from '@mui/material/Icon';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {GroupService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {defineMessages, useIntl} from 'react-intl';
import {SCGroupType} from '@selfcommunity/types';
import {LoadingButton} from '@mui/lab';

const messages = defineMessages({
  errorLoadImage: {
    id: 'ui.changeGroupPicture.alert',
    defaultMessage: 'ui.changeGroupPicture.alert'
  }
});

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface ChangeGroupPictureProps {
  /**
   * Id of the group. It is optional only for group creation modal.
   * @default null
   */
  groupId?: number;
  /**
   * On change function.
   * @default null
   */
  onChange?: (cover) => void;
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
   * Prop to handle avatar loading in the create group modal.
   * @default false
   */
  isCreationMode?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Change Group Picture component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a button that allows admins to manage their group pictures.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/ChangeGroupPicture)

 #### Import

 ```jsx
 import {ChangeGroupPicture} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCChangeGroupPictureButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCChangeGroupPictureButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function ChangeGroupPicture(inProps: ChangeGroupPictureProps): JSX.Element {
  //PROPS
  const props: ChangeGroupPictureProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {groupId, onChange, autoHide, className, isCreationMode = false, ...rest} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //STATE
  let fileInput = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);

  // INTL
  const intl = useIntl();

  // Anonymous
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Handles avatar upload
   * @param event
   */

  const handleUpload = (event) => {
    fileInput = event.target.files[0];
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 600 && img.height < 600) {
            setAlert(intl.formatMessage(messages.errorLoadImage));
          } else {
            isCreationMode ? onChange && onChange(fileInput) : handleSave();
          }
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        img.src = e.target.result;
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reader.readAsDataURL(fileInput);
    }
  };

  /**
   * Performs save avatar after upload
   */
  function handleSave() {
    setLoading(true);
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formData.append('image_original', fileInput);
    GroupService.changeGroupAvatarOrCover(groupId, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data: SCGroupType) => {
        onChange && onChange(data.image_big);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setLoading(false);
        setAlert(intl.formatMessage(messages.errorLoadImage));
      });
  }

  /**
   * If there is an error
   */
  if (alert) {
    return (
      <Alert color="error" onClose={() => setAlert(null)}>
        {alert}
      </Alert>
    );
  }
  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <>
        <input type="file" onChange={handleUpload} ref={fileInput} hidden accept=".gif,.png,.jpg,.jpeg" />
        <Root
          className={classNames(classes.root, className)}
          size="small"
          variant="contained"
          disabled={loading}
          onClick={() => fileInput.current.click()}
          loading={loading}
          {...rest}>
          <Icon>photo_camera</Icon>
        </Root>
      </>
    );
  }
  return null;
}
