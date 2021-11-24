import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {Chip, InternalStandardProps as StandardProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {AutocompleteClasses} from '@mui/material/Autocomplete/autocompleteClasses';
import {OverridableStringUnion} from '@mui/types';
import {AutocompletePropsSizeOverrides} from '@mui/material/Autocomplete/Autocomplete';
import {SCTagType} from '@selfcommunity/core/src/types';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import TagChip from '../../../shared/TagChip';

const PREFIX = 'SCComposerAudience';

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  minWidth: 120
}));

export interface AudienceProps extends StandardProps<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /**
   * Override or extend the styles applied to the component.
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
  defaultValue?: SCTagType[];
  limitCountTags?: number;
  checkboxSelect?: boolean;
  TextFieldProps?: TextFieldProps;
  onChange?: (value: any) => void;
}

export default function ({
  defaultValue = [],
  limitCountTags = 0,
  checkboxSelect = false,
  disabled = false,
  TextFieldProps = {
    variant: 'outlined',
    label: <FormattedMessage id="ui.composer.audience.tags.label" defaultMessage="ui.composer.audience.tags.label" />
  },
  ...props
}: AudienceProps): JSX.Element {
  // Props
  const {onChange, ...rest} = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [value, setValue] = useState(defaultValue);

  const load = () => {
    http
      .request({
        url: Endpoints.ComposerAddressingTagList.url(),
        method: Endpoints.ComposerAddressingTagList.method
      })
      .then((res: AxiosResponse<any>) => {
        setTags(res.data);
      })
      .then(() => setIsLoading(false));
  };

  // Component update
  useEffect(() => {
    if (!isLoading && open && tags.length === 0) {
      load();
    }
  }, [open]);

  // Handlers

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SyntheticEvent, value: any) => {
    let newValue = null;
    if (limitCountTags > 0) {
      const [...rest] = value;
      newValue = rest.slice(-1 * limitCountTags);
    } else {
      newValue = value;
    }
    setValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <Root
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      disabled={disabled}
      multiple
      options={tags || []}
      getOptionLabel={(option: SCTagType) => option.name || ''}
      value={value}
      filterSelectedOptions={!checkboxSelect}
      disableCloseOnSelect={checkboxSelect}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      clearIcon={null}
      noOptionsText={<FormattedMessage id="ui.composer.audience.tags.empty" defaultMessage="ui.composer.audience.tags.empty" />}
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
            {checkboxSelect && <Checkbox style={{marginRight: 8}} checked={selected} />}
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
