import React, {SyntheticEvent, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {InternalStandardProps as StandardProps} from '@mui/material';
import {styled} from '@mui/material/styles';
import {AutocompleteClasses} from '@mui/material/Autocomplete/autocompleteClasses';
import {OverridableStringUnion} from '@mui/types';
import {AutocompletePropsSizeOverrides} from '@mui/material/Autocomplete/Autocomplete';
import {SCTagType} from '@selfcommunity/types';
import TagChip from '../../../shared/TagChip';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCComposerAudience';

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

export interface AudienceProps extends StandardProps<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
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
   * The addressing tags to use to address the content
   * @default []
   */
  tags: SCTagType[];
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
   * If `true`, the autocomplete will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Force the visibility display of the popup icon.
   * @default 'auto'
   */
  defaultValue?: SCTagType[];
  /**
   * The maximum number of tags that will be visible when not focused.
   * @default 0
   */
  limitCountTags?: number;
  /**
   * If checkbox is selected
   * @default false
   */
  checkboxSelect?: boolean;
  /**
   * The props applied to text field
   * @default {variant: 'outlined, label: audience_tags_label}
   */
  TextFieldProps?: TextFieldProps;
  /**
   * Callback for change event on poll object
   * @param value
   * @default empty object
   */
  onChange?: (value: any) => void;
}

export default function (inProps: AudienceProps): JSX.Element {
  // Props
  const props: AudienceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    onChange,
    defaultValue = [],
    limitCountTags = 0,
    checkboxSelect = false,
    disabled = false,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.composer.audience.tags.label" defaultMessage="ui.composer.audience.tags.label" />
    },
    tags = [],
    ...rest
  } = props;

  // State
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

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
      className={classes.root}
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
              endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            }}
          />
        );
      }}
      {...rest}
    />
  );
}
