import React, {SyntheticEvent, useCallback, useEffect, useMemo, useState} from 'react';
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
import {UserService} from '@selfcommunity/api-services';

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
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<any>(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const [textAreaValue, setTextAreaValue] = useState<string>('');

  // Exclude selected users by ID
  const excludeIds = useMemo(
    () =>
      value
        .map((u: SCUserAutocompleteType | string) => (typeof u === 'object' ? u.id : null))
        .filter(Boolean)
        .join(','),
    [value]
  );

  // Fetch users excluding selected ones
  const {users, isLoading} = useSCFetchUsers({search: inputValue?.length >= 3 ? inputValue : '', exclude: excludeIds});
  const filteredUsers = users.filter((u) => !excludeIds.includes(u.id));

  useEffect(() => {
    onChange?.(value);
    setTextAreaValue(value.map((u) => (typeof u === 'object' ? u.username : u)).join('\n'));
  }, [value]);

  // Handlers
  const handleOpen = useCallback(() => {
    if (filteredUsers.length > 0) {
      setOpen(true);
    }
  }, [filteredUsers]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (_event: SyntheticEvent, newValue: SCUserAutocompleteType[]) => {
    setValue(newValue);
  };

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const names = Array.from(
      new Set(
        e.target.value
          .split(/\s|,|\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );
    try {
      if (names.length > 0) {
        const resp: SCUserAutocompleteType[] = await UserService.matchUsernames(names);
        const resolvedUsernames = new Set(resp.map((u) => u.username));
        const resolvedUsers = resp.filter((u) => resolvedUsernames.has(u.username));
        setValue(resolvedUsers);
        setTextAreaValue(resolvedUsers.map((u) => u.username).join('\n'));
      } else {
        setValue([]);
        setTextAreaValue('');
      }
    } catch (err) {
      console.error(`Failed fetching matching usernames`, err);
      setValue([]);
      setTextAreaValue('');
    }
  };

  const filterOptions = useCallback((options: SCUserAutocompleteType[], state: {inputValue: string}) => {
    const search = state.inputValue.toLowerCase();

    return options.filter((option) => {
      const usernameMatch = option.username?.toLowerCase().includes(search);
      const nameMatch = option.real_name?.toLowerCase().includes(search);

      return usernameMatch || nameMatch;
    });
  }, []);

  return (
    <Root className={classes.root}>
      <AutocompleteRoot
        multiple
        className={classes.autocompleteRoot}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        options={filteredUsers || []}
        filterOptions={filterOptions}
        getOptionLabel={(option: SCUserAutocompleteType) => option.username || ''}
        value={value}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        handleHomeEndKeys
        clearIcon={null}
        disabled={disabled || isLoading}
        noOptionsText={<FormattedMessage id="ui.userAutocomplete.empty" defaultMessage="ui.userAutocomplete.empty" />}
        onChange={handleChange}
        isOptionEqualToValue={(option: SCUserAutocompleteType, val: SCUserAutocompleteType) => (option ? val.id === option.id : false)}
        renderTags={(value, getTagProps) =>
          value.map((option: SCUserAutocompleteType | string, index) => {
            const username = typeof option === 'string' ? option : option.username;
            const avatar = typeof option === 'string' ? '' : option.avatar;
            const id = typeof option === 'string' ? `fallback-${option}` : option.id;

            return <Chip key={id} avatar={<Avatar src={avatar} />} label={username} {...getTagProps({index})} />;
          })
        }
        renderOption={(props, option: SCUserAutocompleteType, {inputValue}) => {
          const matches = match(option.username, inputValue);
          const parts = parse(option.username, matches);
          return (
            <Box component="li" {...props}>
              <Avatar alt={option.username} src={option.avatar} sx={{marginRight: 1}} />
              <React.Fragment>
                {parts.map((part, index) => (
                  <Typography key={index}>{part.text}</Typography>
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
            slotProps={{
              input: {
                ...params.InputProps,
                autoComplete: 'off',
                endAdornment:
                  filteredUsers.length > 0 ? (
                    <>
                      {isLoading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ) : null
              }
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
            icon: (chunks) => <Icon key="ui.userAutocomplete.textarea.info.icon">{chunks}</Icon>
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
