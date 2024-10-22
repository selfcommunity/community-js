import {Button, Icon} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCPreferences, SCPreferencesContextType, SCUserContext, SCUserContextType, useSCPreferences} from '@selfcommunity/react-core';
import classNames from 'classnames';
import React, {useContext, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCEventType, SCFeatureName, SCLiveStreamType} from '@selfcommunity/types';
import CreateLivestreamDialog, {CreateLiveStreamDialogProps} from '../CreateLiveStreamDialog';

const PREFIX = 'SCCreateLivestreamButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface CreateLivestreamButtonProps extends ButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  CreateLiveStreamDialogComponentProps?: CreateLiveStreamDialogProps;

  /**
   * On click callback function
   * @default null
   */
  onButtonClick?: (event: any, reason: any) => void;

  /**
   * On success callback function
   * @default null
   */
  onSuccess?: (data: SCEventType | SCLiveStreamType) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS CreateLiveStreamButton component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateLiveStreamButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateLiveStreamButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function CreateLiveStreamButton(inProps: CreateLivestreamButtonProps): JSX.Element {
  //PROPS
  const props: CreateLivestreamButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, CreateLiveStreamDialogComponentProps = {}, onSuccess, children, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const [open, setOpen] = React.useState(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // TODO
  const liveStreamEnabled = true;
  /* const liveStreamEnabled = useMemo(
		() =>
			preferences &&
			features &&
			features.includes(SCFeatureName.LIVE_STREAM) &&
			SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
			preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
		[preferences, features]
	); */
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const canCreateLiveStream = useMemo(() => true /* scUserContext?.user?.permission?.create_livestream */, [scUserContext?.user?.permission]);

  /**
   * Handle close
   */
  const handleClose = () => {
    setOpen((o) => !o);
  };

  /**
   * Handle close
   */
  const handleSuccess = (data: SCEventType | SCLiveStreamType) => {
    onSuccess && onSuccess(data);
    setOpen((o) => !o);
  };

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!liveStreamEnabled || !canCreateLiveStream || !authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <React.Fragment>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClose}
        variant="contained"
        color="secondary"
        startIcon={<Icon>photo_camera</Icon>}
        {...rest}>
        {children ?? <FormattedMessage id="ui.createEventButton.goLive" defaultMessage="ui.createEventButton.goLive" />}
      </Root>
      {open && <CreateLivestreamDialog open onClose={handleClose} onSuccess={handleSuccess} {...CreateLiveStreamDialogComponentProps} />}
    </React.Fragment>
  );
}
