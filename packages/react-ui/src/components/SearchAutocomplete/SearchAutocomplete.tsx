import {Autocomplete, AutocompleteProps, Avatar, Box, Fade, IconButton, styled, TextField, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCSuggestionType, SuggestionType} from '@selfcommunity/types';
import {SuggestionService} from '@selfcommunity/api-services';
import {SCPreferences, SCPreferencesContextType, useSCPreferences} from '@selfcommunity/react-core';

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
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
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
      | 'inputValue'
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
   * The search form shoul focus on mount
   * @default false
   */
  autoFocus?: boolean;
  /**
   * Handler for search action
   */
  onSearch?: (value: string) => void;
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
    autoFocus = false,
    onSearch = null,
    onClear = null,
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
    event.preventDefault();
    event.stopPropagation();
    switch (reason) {
      case 'selectOption':
        onSuggestionSelect && onSuggestionSelect(value);
        handleClear(event);
        break;
      case 'createOption':
        onSearch && onSearch(value);
        handleClear(event);
        break;
    }
    return false;
  };

  const handleClear = (event) => {
    setValue('');
    setOptions([]);
    onClear && onClear();
  };

  const getOptionData = (option) => {
    let data: any = {};
    if (option.type === SuggestionType.USER) {
      data.name = option[SuggestionType.USER]['username'];
      data.image = option[SuggestionType.USER]['avatar'];
      data.variant = 'circular';
    } else if (option.type === SuggestionType.CATEGORY) {
      data.name = option[SuggestionType.CATEGORY]['name'];
      data.image = option[SuggestionType.CATEGORY]['image_medium'];
      data.variant = 'square';
    } else if (option.type === SuggestionType.GROUP) {
      data.name = option[SuggestionType.GROUP]['name'];
      data.image = option[SuggestionType.GROUP]['image_big'];
      data.variant = 'circular';
    }
    return data;
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
      inputValue={value}
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
          <Avatar alt={getOptionData(option).name} src={getOptionData(option).image} variant={getOptionData(option).variant} />
          <Typography ml={1}>{getOptionData(option).name}</Typography>
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
            autoFocus,
            name: 'search-autocomplete',
            className: classes.input,
            startAdornment: <Icon className={classes.icon}>search</Icon>,
            endAdornment: (
              <Fade in={value.length > 0 || Boolean(onClear)} appear={false}>
                <IconButton className={classes.clear} onClick={handleClear} size="small">
                  <Icon>close</Icon>
                </IconButton>
              </Fade>
            )
          }}
        />
      )}
      {...rest}
    />
  );
}
