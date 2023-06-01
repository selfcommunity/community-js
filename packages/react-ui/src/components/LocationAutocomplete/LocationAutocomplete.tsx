import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {Autocomplete, AutocompleteProps} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCLocalityType} from '@selfcommunity/types/src/index';
import {styled} from '@mui/material/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCLocationAutocomplete';

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

export interface LocationAutocompleteProps
  extends Pick<
    AutocompleteProps<SCLocalityType, false, false, true>,
    Exclude<
      keyof AutocompleteProps<SCLocalityType, false, false, true>,
      | 'options'
      | 'getOptionLabel'
      | 'filterOptions'
      | 'autoComplete'
      | 'includeInputInList'
      | 'filterSelectedOptions'
      | 'value'
      | 'selectOnFocus'
      | 'handleHomeEndKeys'
      | 'noOptionsText'
      | 'onChange'
      | 'onInputChange'
      | 'isOptionEqualToValue'
      | 'renderInput'
      | 'renderOption'
    >
  > {
  /**
   * The props applied to the text field.
   * @default {variant: 'outlined, label: location_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Callback for change event on poll object
   * @param value
   * @default null
   */
  onChange?: (value: any) => void;
}
/**
 * > API documentation for the Community-JS Location Autocomplete component. Learn about the available props and the CSS API.
 * <br/>This component renders a bar that allows users to search (with autocomplete) for cities names.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/LocationAutocomplete)
 *
 * #### Import
 *  ```jsx
 *  import {LocationAutocomplete} from '@selfcommunity/react-ui';
 *  ```
 *  #### Component Name
 *  The name `SCLocationAutocomplete` can be used when providing style overrides in the theme.
 *
 *  #### CSS
 *
 *  |Rule Name|Global class|Description|
 *  |---|---|---|
 *  |root|.SCLocationAutocomplete-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function LocationAutocomplete(inProps: LocationAutocompleteProps): JSX.Element {
  // Props
  const props: LocationAutocompleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    defaultValue = null,
    disabled = false,
    onChange,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.locationAutocomplete.label" defaultMessage="ui.composer.locations.label" />
    },
    ...rest
  } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [value, setValue] = useState<string | SCLocalityType>(defaultValue);
  const [search, setSearch] = useState<string>('');

  const load = (offset = 0, limit = 20) => {
    http
      .request({
        url: Endpoints.ComposerLocalitySearch.url(),
        method: Endpoints.ComposerLocalitySearch.method,
        params: {
          offset,
          limit,
          search: search.trim()
        }
      })
      .then((res: HttpResponse<any>) => {
        setLocations(res.data.results);
      })
      .then(() => setIsLoading(false));
  };

  // Component update
  useEffect(() => {
    if (!isLoading && search.trim().length > 0) {
      load();
    }
  }, [search]);

  useEffect(() => {
    if (value) {
      onChange && onChange(value);
    }
  }, [value]);

  // Handlers

  const handleChange = (event: SyntheticEvent, value) => {
    setValue(value);
    onChange && onChange(value);
  };

  const handleSearch = (event: SyntheticEvent, _search: string) => {
    setSearch(_search);
  };

  // Render
  return (
    <Root
      className={classes.root}
      options={locations || []}
      getOptionLabel={(option: SCLocalityType) => option.full_address || ''}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      selectOnFocus
      handleHomeEndKeys
      disabled={disabled}
      noOptionsText={<FormattedMessage id="ui.locationAutocomplete.empty" defaultMessage="ui.locationAutocomplete.empty" />}
      onChange={handleChange}
      onInputChange={handleSearch}
      isOptionEqualToValue={(option: SCLocalityType, value: SCLocalityType) => value.lat === option.lat && value.lng === option.lng}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...TextFieldProps}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              autoComplete: 'location', // disable autocomplete and autofill
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
      renderOption={(props, option: SCLocalityType, {inputValue}) => {
        const matches = match(option.full_address, inputValue);
        const parts = parse(option.full_address, matches);
        return (
          <li key={`${option.lat}_${option.lng}`} {...props} style={{whiteSpace: 'break-spaces'}}>
            {parts.map((part, index) =>
              part.highlight ? (
                <span key={index} style={{fontWeight: 700}}>
                  {part.text}
                </span>
              ) : (
                part.text
              )
            )}
          </li>
        );
      }}
      {...rest}
    />
  );
}
