import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {SCEventType, SCFeatureName, SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {PREFIX} from './constants';
import EventForm from '../EventForm';
import DialogContent from '@mui/material/DialogContent';
import LiveStreamSelector from './LiveStreamSelector/LiveStreamSelector';
import {CreateLiveStreamStep, LiveStreamType} from './types';
import LiveStreamForm from '../LiveStreamForm';
import {TransitionProps} from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import {Box, Button, Icon} from '@mui/material';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  paddingBottom: '0px !important',
  [`& .${classes.title}`]: {
    display: 'flex'
  },
  [`& .${classes.content}`]: {
    paddingBottom: 0
  }
}));

export interface CreateLiveStreamDialogProps extends BaseDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Open dialog
   * @default true
   */
  open?: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 *> API documentation for the Community-JS CreateLiveStreamDialog component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CreateLivestreamDialog} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCCreateLivestreamDialog` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCreateLivestreamDialog-root|Styles applied to the root element.|
 |content|.SCCreateLivestreamDialog-content|Styles applied to the content element.|



 * @param inProps
 */

export default function CreateLiveStreamDialog(inProps: CreateLiveStreamDialogProps): JSX.Element {
  //PROPS
  const props: CreateLiveStreamDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open = true, onClose, onSuccess, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  const liveStreamEnabled = useMemo(
    () => true,
    /* preferences &&
			features &&
			features.includes(SCFeatureName.LIVE_STREAM) &&
			SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in preferences &&
			preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value*/ [preferences, features]
  );
  const onlyStaffLiveStreamEnabled = useMemo(
    () => true /* preferences[SCPreferences.CONFIGURATIONS_LIVESTREAM_ONLY_STAFF_ENABLED].value */,
    [preferences]
  );
  const canCreateLiveStream = useMemo(
    () =>
      true /* liveStreamEnabled && (scUserContext?.user?.permission?.create_livestream || (onlyStaffLiveStreamEnabled && UserUtils.isStaff(scUserContext.user)))*/,
    [scUserContext?.user, onlyStaffLiveStreamEnabled]
  );

  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );
  const onlyStaffEventEnabled = useMemo(() => preferences[SCPreferences.CONFIGURATIONS_EVENTS_ONLY_STAFF_ENABLED].value, [preferences]);
  const canCreateEvent = useMemo(
    () =>
      eventsEnabled && (scUserContext?.user?.permission?.create_event || true || (onlyStaffEventEnabled && UserUtils.isStaff(scUserContext.user))),
    [scUserContext?.user, eventsEnabled, onlyStaffEventEnabled]
  );

  const canCreateLiveStreamEvent = useMemo(() => Boolean(canCreateLiveStream && canCreateEvent), [canCreateEvent, canCreateLiveStream]);

  // STATE
  const [step, setStep] = useState<CreateLiveStreamStep>(
    canCreateLiveStreamEvent ? CreateLiveStreamStep.SELECT_TYPE : CreateLiveStreamStep.CREATE_LIVE
  );
  const [liveType, setLiveType] = useState<LiveStreamType>(canCreateLiveStreamEvent ? null : LiveStreamType.DIRECT_LIVE);

  // HANDLER
  const handleLiveTypeSelected = useCallback((l) => {
    setLiveType(l);
  }, []);

  const handleLiveTypeSelectedNext = useCallback((l) => {
    setLiveType(l);
    setStep(CreateLiveStreamStep.CREATE_LIVE);
  }, []);

  const handleBack = useCallback((l) => {
    setStep(CreateLiveStreamStep.SELECT_TYPE);
  }, []);

  const handleSubmit = useCallback((e: SCEventType | SCLiveStreamType) => {
    onSuccess && onSuccess(e);
  }, []);

  useEffect(() => {
    if (!canCreateLiveStreamEvent) {
      setLiveType(LiveStreamType.DIRECT_LIVE);
    }
  }, [canCreateLiveStreamEvent]);

  // user must be logged
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      maxWidth={'md'}
      title={
        <Box className={classes.title} component={'span'}>
          {Boolean(step === CreateLiveStreamStep.CREATE_LIVE && canCreateLiveStreamEvent) && (
            <Button variant="text" onClick={handleBack} startIcon={<Icon>arrow_back</Icon>}>
              Back
            </Button>
          )}
          <Box component={'span'}>
            <FormattedMessage id="ui.createLivestreamDialog.title" defaultMessage="ui.createLivestreamDialog.title" />
          </Box>
        </Box>
      }
      fullWidth
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      TransitionComponent={Transition}
      PaperProps={{elevation: 0}}
      {...rest}>
      <Box className={classes.content}>
        {step === CreateLiveStreamStep.SELECT_TYPE && (
          <LiveStreamSelector liveSelected={liveType} onLiveSelected={handleLiveTypeSelected} onNext={handleLiveTypeSelectedNext} />
        )}
        {step === CreateLiveStreamStep.CREATE_LIVE && (
          <>{liveType === LiveStreamType.EVENT_LIVE ? <EventForm onSuccess={handleSubmit} /> : <LiveStreamForm onSuccess={handleSubmit} />}</>
        )}
      </Box>
    </Root>
  );
}
