import {useContext, useRef, useState} from 'react';
import {Alert, styled, Icon, Button} from '@mui/material';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {defineMessages} from 'react-intl';

const messages = defineMessages({
  errorLoadImage: {
    id: 'ui.changeGroupCover.button.change.alertErrorImage',
    defaultMessage: 'ui.changeGroupCover.button.change.alertErrorImage'
  }
});

const classes = {
  root: `${PREFIX}-upload-course-cover-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'UploadCourseCoverRoot'
})(() => ({}));

export interface UploadCourseCoverProps {
  /**
   * If the image is in uploadingstate
   * @default false
   */
  isUploading: boolean;
  /**
   * On change function.
   * @default null
   */
  onChange?: (cover) => void;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Change Group Cover component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a button that allows admins to edit the group cover and a popover that specifies format and sizes allowed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UploadCourseCover)

 #### Import
 ```jsx
 import {UploadCourseCover} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCUploadCourseCover` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUploadCourseCover-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UploadCourseCover(inProps: UploadCourseCoverProps): JSX.Element {
  //PROPS
  const props: UploadCourseCoverProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {isUploading = false, onChange, className = false, ...rest} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //STATE
  let fileInput = useRef(null);
  const [alert, setAlert] = useState<string | null>(null);

  // Anonymous
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Handles file upload
   * @param event
   */
  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    fileInput = selectedFile;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onChange(fileInput);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

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

  return (
    <>
      <input type="file" onChange={handleUpload} ref={fileInput} hidden accept=".gif,.png,.jpg,.jpeg" />
      <Root
        className={classNames(classes.root, className)}
        size="medium"
        variant="contained"
        disabled={isUploading}
        onClick={() => fileInput.current.click()}
        loading={isUploading}
        {...rest}>
        <Icon>image</Icon>
      </Root>
    </>
  );
}
