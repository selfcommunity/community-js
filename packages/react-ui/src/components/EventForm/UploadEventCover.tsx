import React, {useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Alert} from '@mui/material';
import {SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import {LoadingButton} from '@mui/lab';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {EventService} from '@selfcommunity/api-services';
import {SCEventType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  errorLoadImage: {
    id: 'ui.changeGroupCover.button.change.alertErrorImage',
    defaultMessage: 'ui.changeGroupCover.button.change.alertErrorImage'
  }
});

const classes = {
  root: `${PREFIX}-upload-event-cover-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'UploadEventCoverRoot'
})(() => ({}));

export interface UploadEventCoverProps {
  /**
   * Id of the event. It is optional only for event creation modal.
   * @default null
   */
  eventId?: number;
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
   * Prop to handle cover loading in the create event modal.
   * @default false
   */
  isCreationMode?: boolean;
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
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UploadEventCover)

 #### Import
 ```jsx
 import {UploadEventCover} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCUploadEventCover` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUploadEventCover-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UploadEventCover(inProps: UploadEventCoverProps): JSX.Element {
  //PROPS
  const props: UploadEventCoverProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {eventId, onChange, className = false, isCreationMode = false, ...rest} = props;

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
   * Handles file upload
   * @param event
   */
  const handleUpload = (event) => {
    fileInput = event.target.files[0];
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          isCreationMode ? onChange && onChange(fileInput) : handleSave();
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
   * Handles cover saving after upload action
   */
  function handleSave() {
    setLoading(true);
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formData.append('image_original', fileInput);
    EventService.changeEventAvatarOrCover(eventId, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data: SCEventType) => {
        onChange && onChange(data.image_medium);
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

  return (
    <>
      <input type="file" onChange={handleUpload} ref={fileInput} hidden accept=".gif,.png,.jpg,.jpeg" />
      <Root
        className={classNames(classes.root, className)}
        size="medium"
        variant="contained"
        disabled={loading}
        onClick={() => fileInput.current.click()}
        loading={loading}
        {...rest}>
        <Icon>image</Icon>
      </Root>
    </>
  );
}
