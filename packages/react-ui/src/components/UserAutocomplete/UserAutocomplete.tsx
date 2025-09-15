import React, {Fragment, SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {
  Autocomplete,
  AutocompleteProps,
  Chip,
  TextField,
  TextFieldProps,
  CircularProgress,
  styled,
  Avatar,
  Box,
  Typography,
  Icon
} from '@mui/material';
import {useSCFetchUsers} from '@selfcommunity/react-core';
import {SCUserAutocompleteType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCUserAutocomplete';

const classes = {
  root: `${PREFIX}-root`,
  autocompleteRoot: `${PREFIX}-autocompleteRoot`,
  info: `${PREFIX}-info`
};

export interface UserAutocompleteProps
  extends Pick<
    AutocompleteProps<SCUserAutocompleteType | null, true, any, any>,
    Exclude<
      keyof AutocompleteProps<SCUserAutocompleteType | null, true, any, any>,
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
   * The props applied to text field
   * @default {variant: 'outlined, label: groups_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Callback for change event on poll object
   * @param value
   */
  onChange?: (value: SCUserAutocompleteType[]) => void;
  /**
   * The maximum number of users that will be visible when not focused.
   * @default 0
   */
  limitCountGroups?: number;
  endpointQueryParams?: Record<string, string | number | boolean>;
}

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const AutocompleteRoot = styled(Autocomplete, {
  name: PREFIX,
  slot: 'AutocompleteRoot',
  overridesResolver: (_props, styles) => styles.autocompleteRoot
})(() => ({}));

const UserAutocomplete = (inProps: UserAutocompleteProps): JSX.Element => {
  const props: UserAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    onChange,
    defaultValue = null,
    disabled = false,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.userAutocomplete.label" defaultMessage="ui.userAutocomplete.label" />
    },
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState<boolean>(false);
  // const [value, setValue] = useState<string | SCUserAutocompleteType | (string | SCUserAutocompleteType)[]>(
  //   typeof defaultValue === 'string' ? null : defaultValue
  // );
  const [value, setValue] = useState<any>(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const [textAreaValue, setTextAreaValue] = useState<string>('');

  // Fetch users
  const {users, isLoading} = useSCFetchUsers();

  useEffect(() => {
    if (value === null) {
      return;
    }
    onChange?.(value);
    setTextAreaValue(value.map((u) => u.username).join('\n'));
  }, [value]);

  // Handlers
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (_event: SyntheticEvent, newValue: SCUserAutocompleteType[]) => {
    setValue(newValue);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const names = e.target.value
      .split(/\s|,|\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const matched = users.filter((u) => names.includes(u.username));
    setValue(matched);
    setTextAreaValue(e.target.value);
  };

  return (
    <Root className={classes.root}>
      <AutocompleteRoot
        multiple
        className={classes.autocompleteRoot}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        options={users || []}
        getOptionLabel={(option: SCUserAutocompleteType) => option.username || ''}
        value={value}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        handleHomeEndKeys
        clearIcon={null}
        disabled={disabled || isLoading}
        noOptionsText={<FormattedMessage id="ui.userAutocomplete.empty" defaultMessage="ui.userAutocomplete.empty" />}
        onChange={handleChange}
        isOptionEqualToValue={(option: SCUserAutocompleteType, val: SCUserAutocompleteType) => val.id === option.id}
        renderTags={(value, getTagProps) =>
          value.map((option: any, index) => (
            <Chip key={option.id} avatar={<Avatar src={option.avatar} />} label={option.username} {...getTagProps({index})} />
          ))
        }
        renderOption={(props, option: SCUserAutocompleteType, {inputValue}) => {
          const matches = match(option.username, inputValue);
          const parts = parse(option.username, matches);
          return (
            <Box component="li" {...props}>
              <Avatar alt={option.username} src={option.avatar} sx={{marginRight: 1}} />
              <React.Fragment>
                {parts.map((part, index) => (
                  <Typography key={index} sx={{fontWeight: part.highlight ? 700 : 400}}>
                    {part.text}
                  </Typography>
                ))}
              </React.Fragment>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            {...TextFieldProps}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              autoComplete: 'off',
              endAdornment: (
                <Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              )
            }}
          />
        )}
        {...rest}
      />

      {/* Textarea section for usernames */}
      <Typography variant="body2" color="primary" className={classes.info}>
        <FormattedMessage
          id="ui.userAutocomplete.textarea.info"
          defaultMessage="ui.userAutocomplete.textarea.info"
          values={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            icon: (...chunks) => <Icon>{chunks}</Icon>
          }}
        />
      </Typography>
      <TextField
        label={<FormattedMessage id="ui.userAutocomplete.textarea.label" defaultMessage="ui.userAutocomplete.textarea.label" />}
        multiline
        minRows={4}
        fullWidth
        margin="normal"
        value={textAreaValue}
        onChange={handleTextAreaChange}
      />
    </Root>
  );
};

export default UserAutocomplete;
