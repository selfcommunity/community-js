import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {AutocompleteProps} from '@mui/material';
import {useSCFetchAddressingTagList} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCTagType} from '@selfcommunity/types/src/index';
import {useThemeProps} from '@mui/system';
import TagChip, {TagChipProps} from '../../shared/TagChip';

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
      | 'clearIcon'
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
  overridesResolver: (props, styles) => styles.root
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

  // HOOKS
  const {scAddressingTags} = useSCFetchAddressingTagList({fetch: open});

  useEffect(() => {
    if (value === null) {
      return;
    }
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    if (scAddressingTags && typeof defaultValue === 'string') {
      setValue(scAddressingTags.find((t) => t.id === Number(defaultValue)));
    }
  }, [defaultValue, scAddressingTags]);

  // Handlers

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SyntheticEvent, newValue: SCTagType[]) => {
    setValue(newValue);
  };

  // Render
  return (
    <Root
      className={classes.root}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={scAddressingTags || []}
      getOptionLabel={(option: SCTagType) => option.name || ''}
      value={value}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      clearIcon={null}
      noOptionsText={<FormattedMessage id="ui.composer.layer.audience.tags.empty" defaultMessage="ui.composer.layer.audience.tags.empty" />}
      onChange={handleChange}
      isOptionEqualToValue={(option: SCTagType, value: SCTagType) => value.id === option.id}
      renderTags={(value, getTagProps) => {
        return value.map((option: any, index) => <TagChip key={option.id} tag={option} {...getTagProps({index})} />);
      }}
      renderOption={(props, option: SCTagType, {selected, inputValue}) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <li {...props}>
            <TagChip
              key={option.id}
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
              autoComplete: 'addressing', // disable autocomplete and autofill
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            }}
          />
        );
      }}
      {...rest}
    />
  );
};

export default TagAutocomplete;
