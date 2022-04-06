import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {TextField, Typography, FormGroup, Box} from '@mui/material';
import {Endpoints, formatHttpError, http, Logger, SCUserContextType, useSCUser} from '@selfcommunity/core';
import BaseDialog from '../../../shared/BaseDialog';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {AxiosResponse} from 'axios';
import {LoadingButton} from '@mui/lab';

const messages = defineMessages({
  name: {
    id: 'ui.incubatorsList.createIncubatorDialog.formPlaceholder.name',
    defaultMessage: 'ui.incubatorsList.createIncubatorDialog.formPlaceholder.name'
  },
  slogan: {
    id: 'ui.incubatorsList.createIncubatorDialog.formPlaceholder.slogan',
    defaultMessage: 'ui.incubatorsList.createIncubatorDialog.formPlaceholder.slogan'
  }
});

const PREFIX = 'SCCreateIncubatorDialog';

const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  name: `${PREFIX}-name`,
  slogan: `${PREFIX}-slogan`,
  intro: `${PREFIX}-intro`,
  submittedMessage: `${PREFIX}-submitted-message`
};

const Root = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  margin: 2,
  [theme.breakpoints.down(500)]: {
    minWidth: 300
  },
  [`& .${classes.intro}`]: {
    whiteSpace: 'pre-line'
  },
  [`& .${classes.form}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  [`& .${classes.name}`]: {
    '& .MuiInputBase-root': {
      height: '40px'
    }
  },
  [`& .${classes.submittedMessage}`]: {
    padding: theme.spacing(1),
    borderRadius: '8px',
    backgroundColor: '#bdd5bd'
  }
}));

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

export default function CreateIncubatorDialog(inProps: CreateIncubatorDialogProps): JSX.Element {
  // PROPS
  const props: CreateIncubatorDialogProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
      .then((res: AxiosResponse<any>) => {
        console.log(res.data);
        setIsSubmitting(false);
        setSubmitted(true);
      })
      .catch((error) => {
        setError(formatHttpError(error));
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
          id="ui.incubatorsList.createIncubatorDialog.propose.success"
          defaultMessage="ui.incubatorsList.createIncubatorDialog.propose.success"
        />
      </Typography>
    );
  } else {
    dialogContent = (
      <>
        <Typography component={'span'} className={classes.intro}>
          <FormattedMessage id="ui.incubatorsList.createIncubatorDialog.intro" defaultMessage="ui.incubatorsList.createIncubatorDialog.intro" />
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
          <FormattedMessage id="ui.incubatorsList.createIncubatorDialog.button" defaultMessage="ui.incubatorsList.createIncubatorDialog.button" />
        </LoadingButton>
      </>
    );
  }

  // RENDER
  return (
    <Root
      title={<FormattedMessage id="ui.incubatorsList.createIncubatorDialog.title" defaultMessage="ui.incubatorsList.createIncubatorDialog.title" />}
      open={open}
      onClose={onClose}
      className={classNames(classes.root, className)}
      {...rest}>
      {dialogContent}
    </Root>
  );
}
