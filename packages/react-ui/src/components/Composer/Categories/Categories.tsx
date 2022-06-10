import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {Chip, InternalStandardProps as StandardProps} from '@mui/material';
import {useSCFetchCategories} from '@selfcommunity/react-core';
import {styled} from '@mui/material/styles';
import {AutocompleteClasses} from '@mui/material/Autocomplete/autocompleteClasses';
import {OverridableStringUnion} from '@mui/types';
import {AutocompletePropsSizeOverrides} from '@mui/material/Autocomplete/Autocomplete';
import {SCCategoryType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCComposerCategories';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  minWidth: 120
}));

export interface CategoriesProps extends StandardProps<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /**
   * Overrides or extends the styles applied to the component.
   */
  classes?: Partial<AutocompleteClasses>;
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: OverridableStringUnion<'small' | 'medium', AutocompletePropsSizeOverrides>;
  /**
   * The maximum number of tags that will be visible when not focused.
   * Set `-1` to disable the limit.
   * @default -1
   */
  limitTags?: number;
  /**
   * If `true`, hide the selected options from the list box.
   * @default false
   */
  filterSelectedOptions?: boolean;
  /**
   * If `true`, the popup won't close when a value is selected.
   * @default false
   */
  disableCloseOnSelect?: boolean;
  /**
   * If `true`, the autocomplede will be disabled.
   * @default false
   */
  disabled?: boolean;
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

export default function (inProps: CategoriesProps): JSX.Element {
  const props: CategoriesProps = useThemeProps({
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
      multiple
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
}
