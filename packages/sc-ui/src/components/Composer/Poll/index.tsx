import React, {forwardRef, useEffect, useState} from 'react';
import {Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, TextField} from '@mui/material';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ChoiceIcon from '@mui/icons-material/CheckOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import {ReactSortable} from 'react-sortablejs';
import InputAdornment from '@mui/material/InputAdornment';
import {DatePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const PREFIX = 'SCComposerPoll';

const classes = {
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
const DEFAULT_CHOICE = {choice: ''};
const DEFAULT_POLL = {
  title: '',
  multiple_choices: false,
  expiration_at: null,
  choices: [{...DEFAULT_CHOICE}, {...DEFAULT_CHOICE}]
};

export default ({poll = null, onChange}: {poll?: any; onChange: (poll: any) => void}): JSX.Element => {
  poll = poll || {...DEFAULT_POLL};

  // STATE
  const [title, setTitle] = useState<string>(poll.title);
  const [multiple, setMultiple] = useState<boolean>(poll.multiple_choices);
  const [expiration, setExpiration] = React.useState<Date | null>(poll.expiration_at);
  const [choices, setChoices] = useState([...poll.choices]);

  // INTL
  const intl = useIntl();

  // Component update
  useEffect(() => {
    onChange && onChange({title, expiration_at: expiration, multiple_choices: multiple, choices});
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

  return (
    <Root>
      <Box className={classes.title}>
        <TextField
          label={<FormattedMessage id="ui.composer.poll.title" defaultMessage="ui.composer.poll.title" />}
          variant="outlined"
          value={title}
          onChange={handleChangeTitle}
          fullWidth
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
                    <ChoiceIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleDeleteChoice(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ))}
        </ReactSortable>
      </Box>
      <Box className={classes.choiceNew}>
        <Button variant="outlined" onClick={handleAddChoice}>
          <AddIcon />
          <FormattedMessage id="ui.composer.poll.choice.add" defaultMessage="ui.composer.choice.add" />
        </Button>
      </Box>
      <Divider />
      <FormGroup className={classes.metadata}>
        <FormControlLabel
          control={<Checkbox checked={multiple} onChange={handleChangeMultiple} />}
          label={<FormattedMessage id="ui.composer.poll.multiple" defaultMessage="ui.composer.poll.multiple" />}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={<FormattedMessage id="ui.composer.poll.expiration" defaultMessage="ui.composer.poll.expiration" />}
            value={expiration}
            onChange={handleChangeExpiration}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </FormGroup>
    </Root>
  );
};
