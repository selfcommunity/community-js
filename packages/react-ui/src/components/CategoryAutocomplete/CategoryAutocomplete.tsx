import {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {
  Autocomplete,
  AutocompleteProps,
  Chip,
  TextField,
  TextFieldProps,
  Checkbox,
  CircularProgress,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import {SCThemeType, useSCFetchCategories} from '@selfcommunity/react-core';
import {SCCategoryType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  paperContrastColor: `${PREFIX}-paper-contrast-color`
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
  /**
   * Feed API Query Params
   * @default [{'limit': 10, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number | boolean>;
}

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));
/**
 * > API documentation for the Community-JS Category Autocomplete component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a bar that allows users to search (with autocomplete) for all the categories available in the application.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/CategoryAutocomplete)
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
    endpointQueryParams = {},
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
  const {categories, isLoading} = useSCFetchCategories({endpointQueryParams});
  const theme = useTheme<SCThemeType>();

  useEffect(() => {
    onChange?.(value);
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

  const handleChange = (_event: SyntheticEvent, value) => {
    let newValue = null;
    if (multiple && limitCountCategories > 0) {
      const [...rest] = value;
      newValue = rest.slice(-1 * limitCountCategories);
    } else {
      newValue = value;
    }
    setValue(newValue);
    onChange?.(newValue);
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
      noOptionsText={
        <Typography component="span" sx={{color: theme.palette.getContrastText(theme.palette.background.paper)}}>
          <FormattedMessage id="ui.categoryAutocomplete.empty" defaultMessage="ui.categoryAutocomplete.empty" />
        </Typography>
      }
      onChange={handleChange}
      isOptionEqualToValue={(option: SCCategoryType, value: SCCategoryType) => value.id === option.id}
      renderValue={(value: any, getItemProps: any) => {
        if (multiple) {
          return (value as any[]).map((option, index) => {
            const {key, ...rest} = getItemProps({index});
            return (
              <Chip
                key={key}
                id={option.id}
                label={
                  <Typography component="span" className={classes.paperContrastColor}>
                    {option.name}
                  </Typography>
                }
                color={option.color}
                {...rest}
              />
            );
          });
        }

        return (
          <Chip
            id={value.id}
            label={
              <Typography component="span" className={classes.paperContrastColor}>
                {value.name}
              </Typography>
            }
            color={value.color}
            {...getItemProps}
          />
        );
      }}
      renderOption={(props, option: SCCategoryType, {selected, inputValue}) => {
        const {key, ...rest} = props;
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <li key={key} {...rest}>
            {checkboxSelect && <Checkbox style={{marginRight: 8}} checked={selected} />}
            <Chip
              label={parts.map((part, index: number) => (
                <Typography
                  component="span"
                  key={index}
                  sx={{fontWeight: part.highlight ? 700 : 400, color: theme.palette.getContrastText(theme.palette.background.paper)}}>
                  {part.text}
                </Typography>
              ))}
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
            slotProps={{
              input: {
                ...params.InputProps,
                autoComplete: 'categories', // disable autocomplete and autofill
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }
            }}
          />
        );
      }}
      {...rest}
    />
  );
};

export default CategoryAutocomplete;
