import React, {forwardRef, useEffect, useState} from 'react';
import {Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, TextField, Tooltip, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Icon from '@mui/material/Icon';
import {ReactSortable} from 'react-sortablejs';
import InputAdornment from '@mui/material/InputAdornment';
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {COMPOSER_POLL_MIN_CHOICES, COMPOSER_POLL_MIN_CLOSE_DATE_DELTA, COMPOSER_POLL_TITLE_MAX_LENGTH} from '../../../constants/Composer';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import {SCFeedWidgetType} from '../../../types/feed';
import {SCPollChoiceType, SCPollType} from '@selfcommunity/core';
import classNames from 'classnames';

const localeMap = {
  en: enLocale,
  it: itLocale
};

const PREFIX = 'SCComposerPoll';

const classes = {
  root: `${PREFIX}-root`,
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
    id: 'ui.composer.poll.choice.placeholder',
    defaultMessage: 'ui.composer.poll.choice.placeholder'
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

export interface PollProps {
  /**
   * Id of the feed object
   * @default 'poll'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Value of the component
   */
  value?: SCPollType | null;

  /**
   * Widgets to insert into the feed
   * @default empty array
   */
  error?: SCFeedWidgetType[];

  /**
   * Callback for change event on poll object
   * @default empty object
   */
  onChange: (value: SCPollType) => void;
}

export default (props: PollProps): JSX.Element => {
  // PROPS
  const {id = 'poll', className = null, value = {...DEFAULT_POLL}, error = {}, onChange} = props;
  const {titleError = null} = {...error};

  // STATE
  const [title, setTitle] = useState<string>(value !== null ? value.title : DEFAULT_POLL.title);
  const [multiple, setMultiple] = useState<boolean>(value !== null ? value.multiple_choices : DEFAULT_POLL.multiple_choices);
  const [expiration, setExpiration] = React.useState<Date | null>(value !== null ? value.expiration_at : DEFAULT_POLL.expiration_at);

  const _choicesInitialState: SCPollChoiceType[] = [...(value !== null ? value.choices : DEFAULT_POLL.choices)];
  while (_choicesInitialState.length < COMPOSER_POLL_MIN_CHOICES) {
    _choicesInitialState.push({...DEFAULT_CHOICE});
  }
  const [choices, setChoices] = useState<SCPollChoiceType[]>(_choicesInitialState);

  // INTL
  const intl = useIntl();

  // Component update
  useEffect(() => {
    if (onChange && (title || expiration !== null || choices.filter((c) => c.choice.length > 0).length > 0)) {
      onChange({title, expiration_at: expiration, multiple_choices: multiple, choices: choices.filter((c) => c.choice.length > 0)});
    }
  }, [title, multiple, expiration, choices]);

  // HANDLERS
  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeMultiple = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMultiple(event.target.checked);
  };

  const handleChangeExpiration = (value: any) => {
    setExpiration(value);
  };

  const handleAddChoice = () => {
    setChoices([...choices, {...DEFAULT_CHOICE}]);
  };

  const handleChangeChoice = (index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const _choices = [...choices];
      _choices[index].choice = event.target.value;
      setChoices(_choices);
    };
  };

  const handleDeleteChoice = (index: number) => {
    return () => {
      const _choices = [...choices];
      _choices.splice(index, 1);
      setChoices(_choices);
    };
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + COMPOSER_POLL_MIN_CLOSE_DATE_DELTA);

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <Box className={classes.title}>
        <TextField
          label={<FormattedMessage id="ui.composer.poll.title" defaultMessage="ui.composer.poll.title" />}
          variant="outlined"
          value={title}
          onChange={handleChangeTitle}
          fullWidth
          error={Boolean(titleError)}
          helperText={titleError ? titleError.error : null}
          InputProps={{
            endAdornment: <Typography variant="body2">{COMPOSER_POLL_TITLE_MAX_LENGTH - title.length}</Typography>
          }}
        />
      </Box>
      <Box className={classes.choices}>
        <ReactSortable list={[...choices] as any[]} setList={(newSort) => setChoices(newSort)} tag={SortableComponent}>
          {choices.map((choice: any, index: number) => (
            <TextField
              key={index}
              placeholder={intl.formatMessage(messages.choicePlaceholder)}
              value={choice.choice}
              onChange={handleChangeChoice(index)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>check</Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={
                        choices.length <= COMPOSER_POLL_MIN_CHOICES ? (
                          <FormattedMessage id="ui.composer.poll.choice.delete.disabled" defaultMessage="ui.composer.poll.choice.delete.disabled" />
                        ) : (
                          <FormattedMessage id="ui.composer.poll.choice.delete" defaultMessage="ui.composer.poll.choice.delete" />
                        )
                      }>
                      <span>
                        <IconButton onClick={handleDeleteChoice(index)} disabled={choices.length <= COMPOSER_POLL_MIN_CHOICES}>
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
        <Button variant="outlined" onClick={handleAddChoice}>
          <Icon>add</Icon>
          <FormattedMessage id="ui.composer.poll.choice.add" defaultMessage="ui.composer.choice.add" />
        </Button>
      </Box>
      <Divider />
      <FormGroup className={classes.metadata}>
        <FormControlLabel
          control={<Checkbox checked={multiple} onChange={handleChangeMultiple} />}
          label={<FormattedMessage id="ui.composer.poll.multiple" defaultMessage="ui.composer.poll.multiple" />}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[intl.locale]}>
          <DatePicker
            label={<FormattedMessage id="ui.composer.poll.expiration" defaultMessage="ui.composer.poll.expiration" />}
            value={expiration}
            onChange={handleChangeExpiration}
            renderInput={(params) => <TextField {...params} />}
            minDate={minDate}
          />
        </LocalizationProvider>
      </FormGroup>
    </Root>
  );
};
