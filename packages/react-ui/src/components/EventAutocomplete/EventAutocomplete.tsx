import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {AutocompleteProps, Avatar, Box, Typography} from '@mui/material';
import {useSCFetchEvents} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCEventType} from '@selfcommunity/types/src/index';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCEventAutocomplete';

const classes = {
  root: `${PREFIX}-root`
};

export interface EventAutocompleteProps
  extends Pick<
    AutocompleteProps<SCEventType | null, any, any, any>,
    Exclude<
      keyof AutocompleteProps<SCEventType | null, any, any, any>,
      | 'open'
      | 'onOpen'
      | 'onClose'
      | 'onChange'
      | 'filterSelectedOptions'
      | 'disableCloseOnSelect'
      | 'options'
      | 'getOptionLabel'
      | 'value'
      | 'selectOnFocus'
      | 'clearOnBlur'
      | 'blurOnSelect'
      | 'handleHomeEndKeys'
      | 'clearIcon'
      | 'noOptionsText'
      | 'isOptionEqualToValue'
      | 'renderTags'
      | 'renderOption'
      | 'renderInput'
    >
  > {
  /**
   * The maximum number of events that will be visible when not focused.
   * @default 0
   */
  limitCountEvents?: number;
  /**
   * If checkbox is selected
   * @default false
   */
  checkboxSelect?: boolean;
  /**
   * The props applied to text field
   * @default {variant: 'outlined, label: events_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Callback for change event on event object
   * @param value
   */
  onChange?: (value: any) => void;
}

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));
/**
 * > API documentation for the Community-JS Event Autocomplete component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a bar that allows users to search (with autocomplete) for all the events available in the application.
 *
 * #### Import
 *  ```jsx
 *  import {EventAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCEventAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCEventAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
const EventAutocomplete = (inProps: EventAutocompleteProps): JSX.Element => {
  const props: EventAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // Props
  const {
    onChange,
    defaultValue = null,
    disabled = false,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.eventAutocomplete.label" defaultMessage="ui.eventAutocomplete.label" />
    },
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | SCEventType | (string | SCEventType)[]>(typeof defaultValue === 'string' ? null : defaultValue);

  // HOOKS
  const {events, isLoading} = useSCFetchEvents();

  useEffect(() => {
    if (value === null) {
      return;
    }
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    if (!isLoading && typeof defaultValue === 'string') {
      setValue(events.find((e) => e.id === Number(defaultValue)));
    }
  }, [isLoading]);

  // Handlers

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: SyntheticEvent, value) => {
    setValue(value);
  };

  // Render
  return (
    <Root
      className={classes.root}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={events || []}
      getOptionLabel={(option: SCEventType) => option.name || ''}
      value={value}
      selectOnFocus
      clearOnBlur
      blurOnSelect
      handleHomeEndKeys
      clearIcon={null}
      disabled={disabled || isLoading}
      noOptionsText={<FormattedMessage id="ui.eventAutocomplete.empty" defaultMessage="ui.eventAutocomplete.empty" />}
      onChange={handleChange}
      isOptionEqualToValue={(option: SCEventType, value: SCEventType) => value.id === option.id}
      // renderTags={(value, getTagProps) => {
      //   return value.map((option: any, index) => (
      //     <Chip key={option.id} id={option.id} label={option.name} color={option.color} {...getTagProps({index})} />
      //   ));
      // }}
      renderOption={(props, option: SCEventType, {inputValue}) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <Box component="li" {...props}>
            <Avatar alt={option.name} src={option.image_small} sx={{marginRight: 1}} />
            <React.Fragment>
              {parts.map((part, index) => (
                <Typography key={index} sx={{fontWeight: part.highlight ? 700 : 400, marginRight: 0.2}}>
                  {part.text}
                </Typography>
              ))}
            </React.Fragment>
          </Box>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...TextFieldProps}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              autoComplete: 'events', // disable autocomplete and autofill
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        );
      }}
      {...rest}
    />
  );
};

export default EventAutocomplete;
