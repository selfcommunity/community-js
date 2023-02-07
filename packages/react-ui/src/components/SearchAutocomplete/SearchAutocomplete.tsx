import {Autocomplete, AutocompleteProps, Avatar, Box, IconButton, styled, TextField, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCSuggestionType, SuggestionType} from '@selfcommunity/types';
import {SuggestionService} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';
import {ChipTypeMap} from '@mui/material/Chip';

const messages = defineMessages({
  placeholder: {
    id: 'ui.searchAutocomplete.placeholder',
    defaultMessage: 'ui.searchAutocomplete.placeholder'
  }
});

const PREFIX = 'SCSearchAutocomplete';

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  input: `${PREFIX}-input`,
  clear: `${PREFIX}-clear`
};

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root'
})(({theme}) => ({
  [`& .${classes.input}`]: {
    flexGrow: 1
  }
}));

export interface SearchAutocompleteProps
  extends Pick<
    AutocompleteProps<string, false, false, true>,
    Exclude<
      keyof AutocompleteProps<string, false, false, true>,
      | 'freeSolo'
      | 'multiple'
      | 'autoComplete'
      | 'loading'
      | 'loadingText'
      | 'noOptionsText'
      | 'options'
      | 'getOptionLabel'
      | 'onInputChange'
      | 'renderOption'
      | 'renderInput'
    >
  > {
  /**
   * Handler for search action
   */
  onSearch?: (value) => void;
  /**
   * Handler for clear action
   */
  onClear?: () => void;
  /**
   * Handler for item select action
   */
  onSuggestionSelect?: (suggestion: SCSuggestionType) => void;
}

export default function SearchAutocomplete(inProps: SearchAutocompleteProps) {
  // PROPS
  const props: SearchAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `${PREFIX}-autocomplete`,
    className,
    blurOnSelect,
    onSearch = () => null,
    onClear = () => null,
    onSuggestionSelect = (suggestion: SCSuggestionType) => null,
    ...rest
  } = props;

  // CONTEXT
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // STATE
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<SCSuggestionType[]>([]);

  // INTL
  const intl = useIntl();

  const handleInputChange = (event, value, reason) => {
    switch (reason) {
      case 'input':
        setValue(value);
        !value && setOptions([]);
        break;
    }
  };

  const handleChange = (event, value, reason, detail) => {
    switch (reason) {
      case 'selectOption':
        onSuggestionSelect && onSuggestionSelect(value);
        break;
      case 'createOption':
        onSearch && onSearch(value);
        break;
    }
  };

  const handleClear = (event) => {
    onClear && onClear();
  };

  function fetchResults() {
    setIsLoading(true);
    SuggestionService.getSearchSuggestion(value)
      .then((data) => {
        setIsLoading(false);
        setOptions(data.results);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }
  useEffect(() => {
    if (value) {
      fetchResults();
    }
  }, [value]);

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      blurOnSelect={blurOnSelect}
      onChange={handleChange}
      onInputChange={handleInputChange}
      freeSolo
      autoComplete
      disableClearable
      loading={isLoading}
      loadingText={<FormattedMessage id="ui.searchAutocomplete.loading" defaultMessage="ui.searchAutocomplete.loading" />}
      noOptionsText={<FormattedMessage id="ui.searchAutocomplete.noOptions" defaultMessage="ui.searchAutocomplete.noOptions" />}
      options={options}
      getOptionLabel={(option: SCSuggestionType | string) => {
        if (typeof option === 'string') {
          return option;
        }
        return option[option.type]['username'] ?? option[option.type]['name'];
      }}
      renderOption={(props, option: SCSuggestionType) => (
        <Box component="li" {...props}>
          {option.type === SuggestionType.USER ? (
            <>
              <Avatar alt={option[SuggestionType.USER]['username']} src={option[SuggestionType.USER]['avatar']} />
              <Typography ml={1}>{option[SuggestionType.USER]['username']}</Typography>
            </>
          ) : (
            <>
              <Avatar alt={option[SuggestionType.CATEGORY]['name']} src={option[SuggestionType.CATEGORY]['image_small']} variant="square" />
              <Typography ml={1}>{option[SuggestionType.CATEGORY]['name']}</Typography>
            </>
          )}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={`${intl.formatMessage(messages.placeholder, {
            community: scPreferences.preferences[SCPreferences.TEXT_APPLICATION_NAME].value
          })}`}
          InputProps={{
            ...params.InputProps,
            className: classes.input,
            startAdornment: <Icon className={classes.icon}>search</Icon>,
            endAdornment: (
              <IconButton className={classes.clear} onClick={handleClear}>
                <Icon>close</Icon>
              </IconButton>
            )
          }}
        />
      )}
      {...rest}
    />
  );
}
