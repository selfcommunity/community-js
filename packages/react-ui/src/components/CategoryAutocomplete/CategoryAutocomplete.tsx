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
    AutocompleteProps<string, true, false, true>,
    Exclude<
      keyof AutocompleteProps<string, true, false, true>,
      | 'defaultValue'
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
   * Force the visibility display of the popup icon.
   * @default 'auto'
   */
  defaultValue?: SCCategoryType[];
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

const CategoryAutocomplete = (inProps: CategoryAutocompleteProps): JSX.Element => {
  const props: CategoryAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // Props
  const {
    onChange,
    defaultValue = [],
    limitCountCategories = 0,
    checkboxSelect = false,
    disabled = false,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.composer.categories.label" defaultMessage="ui.composer.categories.label" />
    },
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  // HOOKS
  const {categories, isLoading} = useSCFetchCategories();

  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  // Handlers

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SyntheticEvent, value) => {
    let newValue = null;
    if (limitCountCategories > 0) {
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
      disabled={disabled}
      noOptionsText={<FormattedMessage id="ui.composer.categories.empty" defaultMessage="ui.composer.categories.empty" />}
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
