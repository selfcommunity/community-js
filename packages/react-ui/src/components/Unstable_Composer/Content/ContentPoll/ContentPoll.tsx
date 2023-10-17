import React, { forwardRef, SyntheticEvent, useCallback, useMemo } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Icon from '@mui/material/Icon';
import { ReactSortable } from 'react-sortablejs';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  COMPOSER_POLL_MIN_CHOICES,
  COMPOSER_POLL_MIN_CLOSE_DATE_DELTA,
  COMPOSER_POLL_TITLE_MAX_LENGTH,
} from '../../../../constants/Composer';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import { SCPollChoiceType } from '@selfcommunity/types/src/index';
import classNames from 'classnames';
import { useThemeProps } from '@mui/system';
import { parseISO } from 'date-fns';
import { ComposerContentType } from '../../../../types/composer';

const localeMap = {
  en: enLocale,
  it: itLocale
};

const PREFIX = 'SCComposerContentPoll';

const classes = {
  root: `${PREFIX}-root`,
  generalError: `${PREFIX}-generalError`,
  title: `${PREFIX}-title`,
  choices: `${PREFIX}-choices`,
  choiceNew: `${PREFIX}-choice-new`,
  metadata: `${PREFIX}-metadata`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  padding: theme.spacing(2),
  [`& .${classes.generalError}`]: {
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main
  },
  [`& .${classes.title}, & .${classes.choices}, & .${classes.choiceNew}, & .${classes.metadata}`]: {
    marginBottom: theme.spacing(3)
  },
  [`& .${classes.choices} .MuiTextField-root`]: {
    marginBottom: theme.spacing()
  },
  [`& .${classes.metadata}`]: {
    marginTop: theme.spacing(3)
  }
}));

const messages = defineMessages({
  choicePlaceholder: {
    id: 'ui.unstable_composer.content.poll.choice.placeholder',
    defaultMessage: 'ui.unstable_composer.content.poll.choice.placeholder'
  }
});

const SortableComponent = forwardRef<HTMLDivElement, any>(({children, ...props}, ref) => {
  return (
    <FormGroup direction="column" ref={ref} {...props}>
      {children}
    </FormGroup>
  );
});

/**
 * Default poll
 */
const DEFAULT_CHOICE: SCPollChoiceType = {choice: ''};
const DEFAULT_POLL = {
  title: '',
  multiple_choices: false,
  expiration_at: null,
  choices: [{...DEFAULT_CHOICE}, {...DEFAULT_CHOICE}]
};

export interface ContentPollProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: ComposerContentType | null;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  error?: any;

  /**
   * All the inputs should be disabled?
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback for change event on poll object
   * @param value
   * @default empty object
   */
  onChange: (value: ComposerContentType) => void;
}

export default (inProps: ContentPollProps): JSX.Element => {
  // PROPS
  const props: ContentPollProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, value = {poll: {...DEFAULT_POLL}} as ComposerContentType, error = {}, disabled, onChange} = props;
  const {titleError = null, error: generalError = null} = {...error};

  // MEMO
  const poll = useMemo(() => value.poll ? value.poll : {...DEFAULT_POLL}, [value, DEFAULT_POLL]);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleChangeTitle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({...value, poll: {...poll, title: event.target.value}})
  }, [value, poll]);

  const handleSortChoices = useCallback((choices) => {
    onChange({...value, poll: {...poll, choices}})
  }, [value, poll]);

  const handleChangeChoice = useCallback((index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const _choices = [...poll.choices];
      _choices[index].choice = event.target.value;
      onChange({...value, poll: {...poll, choices: _choices}})
    };
  }, [value, poll]);

  const handleAddChoice = useCallback(() => {
    onChange({...value, poll: {...poll, choices: [...poll.choices, {...DEFAULT_CHOICE}]}});
  }, [value, poll]);

  const handleDeleteChoice = useCallback((index: number) => {
    return (event: SyntheticEvent) => {
      const _choices = [...poll.choices];
      _choices.splice(index, 1);
      onChange({...value, poll: {...poll, choices: _choices}})
    };
  }, [value, poll]);

  const handleChangeMultiple = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({...value, poll: {...poll, multiple_choices: event.target.checked}});
  }, [value, poll]);

  const handleChangeExpiration = useCallback((expiration: any) => {
    onChange({...value, poll: {...poll, expiration_at: expiration}});
  }, [value, poll]);


  // RENDER
  const minDate = useMemo(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + COMPOSER_POLL_MIN_CLOSE_DATE_DELTA);
    return minDate;
    }, []);

  return (
    <Root className={classNames(classes.root, className)}>
      {generalError && <Typography className={classes.generalError}>{generalError}</Typography>}
      <Box className={classes.title}>
        <TextField
          autoFocus
          disabled={disabled}
          label={<FormattedMessage id="ui.unstable_composer.content.poll.title" defaultMessage="ui.unstable_composer.content.poll.title" />}
          variant="outlined"
          value={poll.title}
          onChange={handleChangeTitle}
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError && titleError}
          InputProps={{
            endAdornment: <Typography variant="body2">{COMPOSER_POLL_TITLE_MAX_LENGTH - poll.title.length}</Typography>
          }}
        />
      </Box>
      <Box className={classes.choices}>
        <ReactSortable list={[...poll.choices] as any[]} setList={handleSortChoices} tag={SortableComponent}>
          {poll.choices.map((choice: any, index: number) => (
            <TextField
              key={index}
              placeholder={intl.formatMessage(messages.choicePlaceholder)}
              value={choice.choice}
              onChange={handleChangeChoice(index)}
              variant="outlined"
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>drag</Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={
                        poll.choices.length <= COMPOSER_POLL_MIN_CHOICES ? (
                          <FormattedMessage id="ui.unstable_composer.content.poll.choice.delete.disabled" defaultMessage="ui.unstable_composer.content.poll.choice.delete.disabled" />
                        ) : (
                          <FormattedMessage id="ui.unstable_composer.content.poll.choice.delete" defaultMessage="ui.unstable_composer.content.poll.choice.delete" />
                        )
                      }>
                      <span>
                        <IconButton onClick={handleDeleteChoice(index)} disabled={poll.choices.length <= COMPOSER_POLL_MIN_CHOICES} edge="end">
                          <Icon>delete</Icon>
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          ))}
        </ReactSortable>
      </Box>
      <Box className={classes.choiceNew}>
        <Button color="inherit" variant="text" onClick={handleAddChoice}>
          <Icon>add</Icon>
          <FormattedMessage id="ui.unstable_composer.content.poll.choice.add" defaultMessage="ui.unstable_composer.choice.add" />
        </Button>
      </Box>
      <Divider />
      <FormGroup className={classes.metadata}>
        <FormControlLabel
          control={<Checkbox checked={poll.multiple_choices} onChange={handleChangeMultiple} />}
          label={<FormattedMessage id="ui.unstable_composer.content.poll.multiple" defaultMessage="ui.unstable_composer.content.poll.multiple" />}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[intl.locale]}>
          <DatePicker
            disabled={disabled}
            label={<FormattedMessage id="ui.unstable_composer.content.poll.expiration" defaultMessage="ui.unstable_composer.content.poll.expiration" />}
            value={typeof poll.expiration_at === 'string' ? parseISO(poll.expiration_at) : poll.expiration_at}
            onChange={handleChangeExpiration}
            slotProps={{textField: {variant: 'outlined'}}}
            minDate={minDate}
          />
        </LocalizationProvider>
      </FormGroup>
    </Root>
  );
};
