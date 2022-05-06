import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import {InternalStandardProps as StandardProps} from '@mui/material';
import {Endpoints, http} from '@selfcommunity/react-core';
import {SCLocalityType} from '@selfcommunity/types';
import {styled} from '@mui/material/styles';
import {AutocompleteClasses} from '@mui/material/Autocomplete/autocompleteClasses';
import {OverridableStringUnion} from '@mui/types';
import {AutocompletePropsSizeOverrides} from '@mui/material/Autocomplete/Autocomplete';
import {AxiosResponse} from 'axios';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCComposerLocation';

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

export interface LocationProps extends StandardProps<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
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
   * If `true`, the autocomplete will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Force the visibility display of the popup icon.
   * @default 'auto'
   */
  defaultValue?: SCLocalityType;
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

export default function Location(inProps: LocationProps): JSX.Element {
  // Props
  const props: LocationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    defaultValue = null,
    disabled = false,
    onChange,
    TextFieldProps = {variant: 'outlined', label: <FormattedMessage id="ui.composer.location.label" defaultMessage="ui.composer.locations.label" />},
    ...rest
  } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [value, setValue] = useState<SCLocalityType | null>(defaultValue);
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
      .then((res: AxiosResponse<any>) => {
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
      noOptionsText={<FormattedMessage id="ui.composer.location.empty" defaultMessage="ui.composer.location.empty" />}
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
