import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {TextField, Typography, FormGroup} from '@mui/material';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import BaseDialog from '../../../shared/BaseDialog';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {PREFIX} from '../constants';

const messages = defineMessages({
  name: {
    id: 'ui.incubatorListWidget.createIncubatorDialog.formPlaceholder.name',
    defaultMessage: 'ui.incubatorListWidget.createIncubatorDialog.formPlaceholder.name'
  },
  slogan: {
    id: 'ui.incubatorListWidget.createIncubatorDialog.formPlaceholder.slogan',
    defaultMessage: 'ui.incubatorListWidget.createIncubatorDialog.formPlaceholder.slogan'
  }
});

const classes = {
  root: `${PREFIX}-create-dialog-root`,
  form: `${PREFIX}-form`,
  name: `${PREFIX}-name`,
  slogan: `${PREFIX}-slogan`,
  intro: `${PREFIX}-intro`,
  submittedMessage: `${PREFIX}-submitted-message`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'CreateDialogRoot'
})(() => ({}));

export interface CreateIncubatorDialogProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Opens dialog
   * @default false
   */
  open: boolean;
  /**
   * On dialog close callback function
   * @default null
   */
  onClose?: () => void;
}

export default function CreateIncubatorDialog(props: CreateIncubatorDialogProps): JSX.Element {
  // PROPS
  const {className, open, onClose, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // INTL
  const intl = useIntl();

  // STATE
  const [name, setName] = useState<string>('');
  const [slogan, setSlogan] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState('');

  // HANDLERS
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    http
      .request({
        url: Endpoints.CreateAnIncubator.url(),
        method: Endpoints.CreateAnIncubator.method,
        data: {
          name: name,
          slogan: slogan
        }
      })
      .then((res: HttpResponse<any>) => {
        setIsSubmitting(false);
        setSubmitted(true);
      })
      .catch((error) => {
        setError(error);
        setIsSubmitting(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  };

  if (!scUserContext.user) {
    return null;
  }

  let dialogContent;
  if (submitted) {
    dialogContent = (
      <Typography variant={'subtitle2'} className={classes.submittedMessage}>
        <FormattedMessage
          id="ui.incubatorListWidget.createIncubatorDialog.propose.success"
          defaultMessage="ui.incubatorListWidget.createIncubatorDialog.propose.success"
        />
      </Typography>
    );
  } else {
    dialogContent = (
      <>
        <Typography component={'span'} className={classes.intro}>
          <FormattedMessage
            id="ui.incubatorsListDialog.createIncubatorDialog.intro"
            defaultMessage="ui.incubatorsListDialog.createIncubatorDialog.intro"
          />
        </Typography>
        <FormGroup className={classes.form}>
          <TextField
            required
            error={Boolean(error)}
            className={classes.name}
            placeholder={`${intl.formatMessage(messages.name)}`}
            margin="normal"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          />
          <TextField
            multiline
            error={Boolean(error)}
            className={classes.slogan}
            placeholder={`${intl.formatMessage(messages.slogan)}`}
            margin="normal"
            value={slogan}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSlogan(event.target.value)}
          />
        </FormGroup>
        <LoadingButton loading={isSubmitting} disabled={!name || Boolean(error)} variant="contained" onClick={handleSubmit}>
          <FormattedMessage
            id="ui.incubatorListWidget.createIncubatorDialog.button"
            defaultMessage="ui.incubatorListWidget.createIncubatorDialog.button"
          />
        </LoadingButton>
      </>
    );
  }

  // RENDER
  return (
    <Root
      title={
        <FormattedMessage
          id="ui.incubatorListWidget.createIncubatorDialog.title"
          defaultMessage="ui.incubatorListWidget.createIncubatorDialog.title"
        />
      }
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      {dialogContent}
    </Root>
  );
}
