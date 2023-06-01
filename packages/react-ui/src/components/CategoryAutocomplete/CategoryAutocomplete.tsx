import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {AutocompleteProps, Chip} from '@mui/material';
import {useSCFetchCategories} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {SCCategoryType} from '@selfcommunity/types/src/index';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCCategoryAutocomplete';

const classes = {
  root: `${PREFIX}-root`
};

export interface CategoryAutocompleteProps
  extends Pick<
    AutocompleteProps<SCCategoryType | null, any, any, any>,
    Exclude<
      keyof AutocompleteProps<SCCategoryType | null, any, any, any>,
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
   * The maximum number of categories that will be visible when not focused.
   * @default 0
   */
  limitCountCategories?: number;
  /**
   * If checkbox is selected
   * @default false
   */
  checkboxSelect?: boolean;
  /**
   * The props applied to text field
   * @default {variant: 'outlined, label: categories_label}
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
 * > API documentation for the Community-JS Category Autocomplete component. Learn about the available props and the CSS API.
 * <br/>This component renders a bar that allows users to search (with autocomplete) for all the categories available in the application.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoryAutocomplete)
 *
 * #### Import
 *  ```jsx
 *  import {CategoryAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCCategoryAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCCategoryAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
const CategoryAutocomplete = (inProps: CategoryAutocompleteProps): JSX.Element => {
  const props: CategoryAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // Props
  const {
    onChange,
    multiple = false,
    defaultValue = multiple ? [] : null,
    limitCountCategories = 0,
    checkboxSelect = false,
    disabled = false,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.categoryAutocomplete.label" defaultMessage="ui.categoryAutocomplete.label" />
    },
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | SCCategoryType | (string | SCCategoryType)[]>(typeof defaultValue === 'string' ? null : defaultValue);

  // HOOKS
  const {categories, isLoading} = useSCFetchCategories();

  useEffect(() => {
    if (value === null) {
      return;
    }
    onChange && onChange(value);
  }, [value]);

  useEffect(() => {
    if (!isLoading && typeof defaultValue === 'string') {
      setValue(multiple ? categories.filter((cat) => cat.id === Number(defaultValue)) : categories.find((cat) => cat.id === Number(defaultValue)));
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
    let newValue = null;
    if (multiple && limitCountCategories > 0) {
      const [...rest] = value;
      newValue = rest.slice(-1 * limitCountCategories);
    } else {
      newValue = value;
    }
    setValue(newValue);
  };

  // Render
  return (
    <Root
      className={classes.root}
      multiple={multiple}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      filterSelectedOptions={!checkboxSelect}
      disableCloseOnSelect={checkboxSelect}
      options={categories || []}
      getOptionLabel={(option: SCCategoryType) => option.name || ''}
      value={value}
      selectOnFocus
      clearOnBlur
      blurOnSelect
      handleHomeEndKeys
      clearIcon={null}
      disabled={disabled || isLoading}
      noOptionsText={<FormattedMessage id="ui.categoryAutocomplete.empty" defaultMessage="ui.categoryAutocomplete.empty" />}
      onChange={handleChange}
      isOptionEqualToValue={(option: SCCategoryType, value: SCCategoryType) => value.id === option.id}
      renderTags={(value, getTagProps) => {
        return value.map((option: any, index) => (
          <Chip key={option.id} id={option.id} label={option.name} color={option.color} {...getTagProps({index})} />
        ));
      }}
      renderOption={(props, option: SCCategoryType, {selected, inputValue}) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);
        return (
          <li {...props}>
            {checkboxSelect && <Checkbox style={{marginRight: 8}} checked={selected} />}
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
              autoComplete: 'categories', // disable autocomplete and autofill
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

export default CategoryAutocomplete;
