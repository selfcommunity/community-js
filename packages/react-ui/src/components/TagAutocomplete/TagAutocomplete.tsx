import React, {Fragment, SyntheticEvent, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {Autocomplete, AutocompleteProps, TextField, TextFieldProps, styled, CircularProgress} from '@mui/material';
import {SCTagType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import TagChip, {TagChipProps} from '../../shared/TagChip';
import {TagService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';

const PREFIX = 'SCTagAutocomplete';

const classes = {
  root: `${PREFIX}-root`
};

export interface TagAutocompleteProps
  extends Pick<
    AutocompleteProps<SCTagType | null, any, any, any>,
    Exclude<
      keyof AutocompleteProps<SCTagType | null, any, any, any>,
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
      | 'noOptionsText'
      | 'isOptionEqualToValue'
      | 'renderTags'
      | 'renderOption'
      | 'renderInput'
    >
  > {
  defaultValue: SCTagType[] | any;
  /**
   * The props applied to text field
   * @default {variant: 'outlined, label: tags_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * The props to spread to TagChip component
   */
  TagChipProps?: Pick<TagChipProps, Exclude<keyof TagChipProps, 'tag'>>;
  /**
   * Callback for change event on poll object
   * @param value
   */
  onChange?: (value: any) => void;
}

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));
/**
 * > API documentation for the Community-JS Tag Autocomplete component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a bar that allows users to search (with autocomplete) for all the tags available in the application.
 *
 * #### Import
 *  ```jsx
 *  import {TagAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCTagAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCTagAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
const TagAutocomplete = (inProps: TagAutocompleteProps): JSX.Element => {
  const props: TagAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // Props
  const {
    onChange,
    defaultValue = null,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.composer.layer.audience.tags.label" defaultMessage="ui.composer.layer.audience.tags.label" />
    },
    TagChipProps = {},
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | SCTagType | (string | SCTagType)[]>(typeof defaultValue === 'string' ? null : defaultValue);
  const [tags, setTags] = useState<SCTagType[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTags = async (query: string): Promise<SCTagType[]> => {
    setLoading(true);
    try {
      const res = await TagService.searchUserTags({search: query || ''});
      const results = res?.results || [];
      setTags(results);
      return results;
    } catch (error) {
      Logger.error(SCOPE_SC_UI, error);
      setTags([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && inputValue.length >= 3) {
      fetchTags(inputValue);
    }
  }, [open, inputValue]);

  useEffect(() => {
    if (value !== null) {
      onChange && onChange(value);
    }
  }, [value]);

  useEffect(() => {
    const loadDefault = async () => {
      if (typeof defaultValue === 'string' && defaultValue.trim() !== '') {
        const results = await fetchTags(defaultValue);
        const match = results.find((t) => t.id === Number(defaultValue));
        if (match) setValue(match);
      }
    };
    loadDefault();
  }, [defaultValue]);

  // Handlers

  const handleOpen = () => {
    if (inputValue.length >= 3) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const handleChange = (_event: SyntheticEvent, newValue: SCTagType[]) => setValue(newValue);

  const filterOptions = useCallback((options: SCTagType[], state: {inputValue: string}) => {
    const search = state.inputValue.toLowerCase();

    return options.filter((option) => {
      const nameMatch = option.name?.toLowerCase().includes(search);
      const descMatch = option.description?.toLowerCase().includes(search);

      return nameMatch || descMatch;
    });
  }, []);

  return (
    <Root
      className={classes.root}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={tags || []}
      filterOptions={filterOptions}
      getOptionLabel={(option: SCTagType) => option.name || ''}
      value={value}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      clearIcon={null}
      noOptionsText={<FormattedMessage id="ui.composer.layer.audience.tags.empty" defaultMessage="ui.composer.layer.audience.tags.empty" />}
      onChange={handleChange}
      isOptionEqualToValue={(option: SCTagType, value: SCTagType) => value?.id === option?.id}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
      renderOption={(props, option: SCTagType, {inputValue}) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <li {...props}>
            <TagChip
              key={option.id}
              disposable={false}
              tag={option}
              label={
                <React.Fragment>
                  {parts.map((part, index) => (
                    <span key={index} style={{fontWeight: part.highlight ? 700 : 400}}>
                      {part.text}
                    </span>
                  ))}
                </React.Fragment>
              }
              {...TagChipProps}
            />
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...TextFieldProps}
            InputProps={{
              ...params.InputProps,
              autoComplete: 'tags',
              endAdornment:
                tags.length > 0 ? (
                  <Fragment>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ) : null
            }}
          />
        );
      }}
      {...rest}
    />
  );
};

export default TagAutocomplete;
