import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {AutocompleteProps, Chip} from '@mui/material';
import {useSCFetchGroups} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCGroupType} from '@selfcommunity/types/src/index';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCGroupAutocomplete';

const classes = {
  root: `${PREFIX}-root`
};

export interface GroupAutocompleteProps
  extends Pick<
    AutocompleteProps<SCGroupType | null, any, any, any>,
    Exclude<
      keyof AutocompleteProps<SCGroupType | null, any, any, any>,
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
   * The maximum number of groups that will be visible when not focused.
   * @default 0
   */
  limitCountGroups?: number;
  /**
   * If checkbox is selected
   * @default false
   */
  checkboxSelect?: boolean;
  /**
   * The props applied to text field
   * @default {variant: 'outlined, label: groups_label}
   */
  TextFieldProps?: TextFieldProps;
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
 * > API documentation for the Community-JS Group Autocomplete component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a bar that allows users to search (with autocomplete) for all the groups available in the application.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/GroupAutocomplete)
 *
 * #### Import
 *  ```jsx
 *  import {GroupAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCGroupAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCGroupAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
const GroupAutocomplete = (inProps: GroupAutocompleteProps): JSX.Element => {
  const props: GroupAutocompleteProps = useThemeProps({
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
      label: <FormattedMessage id="ui.groupAutocomplete.label" defaultMessage="ui.groupAutocomplete.label" />
    },
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | SCGroupType | (string | SCGroupType)[]>(typeof defaultValue === 'string' ? null : defaultValue);

  // HOOKS
  const {groups, isLoading} = useSCFetchGroups();

  useEffect(() => {
    if (value === null) {
      return;
    }
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    if (!isLoading && typeof defaultValue === 'string') {
      setValue(groups.find((g) => g.id === Number(defaultValue)));
    }
  }, [isLoading]);

  // Handlers

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SyntheticEvent, value) => {
    setValue(value);
  };

  // Render
  return (
    <Root
      className={classes.root}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={groups || []}
      getOptionLabel={(option: SCGroupType) => option.name || ''}
      value={value}
      selectOnFocus
      clearOnBlur
      blurOnSelect
      handleHomeEndKeys
      clearIcon={null}
      disabled={disabled || isLoading}
      noOptionsText={<FormattedMessage id="ui.groupAutocomplete.empty" defaultMessage="ui.groupAutocomplete.empty" />}
      onChange={handleChange}
      isOptionEqualToValue={(option: SCGroupType, value: SCGroupType) => value.id === option.id}
      renderTags={(value, getTagProps) => {
        return value.map((option: any, index) => <Chip key={option.id} id={option.id} label={option.name} {...getTagProps({index})} />);
      }}
      renderOption={(props, option: SCGroupType, {inputValue}) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <li {...props}>
            <Chip
              label={
                <React.Fragment>
                  {parts.map((part, index) => (
                    <span key={index} style={{fontWeight: part.highlight ? 700 : 400}}>
                      {part.text}
                    </span>
                  ))}
                </React.Fragment>
              }
            />
          </li>
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
              autoComplete: 'groups', // disable autocomplete and autofill
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

export default GroupAutocomplete;
