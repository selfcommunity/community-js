import React, {Fragment, useCallback} from 'react';
import {LoadingButton} from '@mui/lab';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCContextType, useSCContext} from '@selfcommunity/react-core';
import {SCEventType} from '@selfcommunity/types';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {TransitionProps} from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import {PREFIX} from './constants';
import EventForm from '../EventForm';
import DialogContent from '@mui/material/DialogContent';

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  error: `${PREFIX}-error`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const Transition = React.forwardRef(function Transition(props: TransitionProps & {children: React.ReactElement}, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoTransition = React.forwardRef(function NoTransition(props: {children: React.ReactElement}, ref) {
  return <Fragment> {props.children} </Fragment>;
});

export interface CreateLivestreamDialogProps extends BaseDialogProps {
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
  onSuccess?: (data: SCEventType) => void;

  /**
   * Disable modal
   */
  disableModal?: boolean;

  /* livstream object */
  livestream?: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS CreateLivestreamDialog component. Learn about the available props and the CSS API.
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
 |active|.SCCreateLivestreamDialog-active|Styles applied to the  active element.|
 |title|.SCCreateLivestreamDialog-title|Styles applied to the title element.|
 |content|.SCCreateLivestreamDialog-content|Styles applied to the element.|
 |error|.SCEventForm-error|Styles applied to the error elements.|

 * @param inProps
 */
export default function CreateLivestreamDialog(inProps: CreateLivestreamDialogProps): JSX.Element {
  //PROPS
  const props: CreateLivestreamDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, livestream, open = true, onClose, onSuccess, disableModal = false, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  // INTL
  const intl = useIntl();

  // HANDLER
  const handleSubmit = useCallback(() => {
    return;
  }, []);

  /**
   * Renders root object
   */
  return (
    <Root
      DialogContentProps={{dividers: false}}
      fullWidth
      title={
        livestream ? (
          <FormattedMessage id="ui.createLivestreamDialog.title.edit" defaultMessage="ui.createLivestreamDialog.title.edit" />
        ) : (
          <FormattedMessage id="ui.createLivestreamDialog.title" defaultMessage="ui.createLivestreamDialog.title" />
        )
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      disablePortal
      PaperProps={{elevation: 0}}
      actions={
        <LoadingButton variant="contained" onClick={handleSubmit} color="secondary">
          {event ? (
            <FormattedMessage id="ui.createLivestreamDialog.button.edit" defaultMessage="ui.eventForm.button.edit" />
          ) : (
            <FormattedMessage id="ui.createLivestreamDialog.button.create" defaultMessage="ui.createLivestreamDialog.button.create" />
          )}
        </LoadingButton>
      }
      {...(disableModal ? {TransitionComponent: NoTransition} : {TransitionComponent: Transition})}
      {...rest}>
      <DialogContent dividers>
        <EventForm hideBackdrop disablePortal PaperProps={{elevation: 0}} disableModal />
        {/* <EventForm open fullWidth /> */}
      </DialogContent>
    </Root>
  );
}
