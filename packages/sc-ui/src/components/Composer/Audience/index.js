import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, injectIntl} from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {Chip} from '@mui/material';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCThreadDialogAudience';

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  minWidth: 120
}));

class Audience extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultValue,
      addedTags: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    const self = this;
    let newValue = null;
    if (self.props.limitCountTags > 0) {
      const [...rest] = value;
      newValue = rest.slice(-1 * self.props.limitCountTags);
    } else {
      newValue = value;
    }
    this.setState({value: newValue});
    this.props.onChange && this.props.onChange(newValue);
  }

  render() {
    const self = this;
    return (
      <Root
        className={this.props.className}
        disabled={this.props.disabled}
        size={this.props.size}
        multiple
        limitTags={this.props.limitTags}
        options={this.props.tags || []}
        getOptionLabel={(option) => option.name || ''}
        value={this.state.value}
        filterSelectedOptions={!this.props.checkboxSelect}
        disableCloseOnSelect={this.props.checkboxSelect}
        forcePopupIcon={this.props.forcePopupIcon}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        clearIcon={null}
        noOptionsText={<FormattedMessage id="thread.audience.addressing.empty" defaultMessage="thread.audience.addressing.empty" />}
        onChange={this.handleChange}
        isOptionEqualToValue={(option, value) => value.id === option.id}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip key={option.id} id={option.id} label={option.name} color={option.color} {...getTagProps({index})} />
          ));
        }}
        renderOption={(props, option, {selected, inputValue}) => {
          const matches = match(option.name, inputValue);
          const parts = parse(option.name, matches);
          return (
            <li {...props}>
              {this.props.checkboxSelect && <Checkbox style={{marginRight: 8}} checked={selected} />}
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
                color={option.color}
              />
            </li>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant={self.props.variant}
              label={self.props.inputLabel}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'addressing', // disable autocomplete and autofill
                endAdornment: (
                  <React.Fragment>
                    {self.props.isLoadingTags ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          );
        }}
      />
    );
  }
}

Audience.defaultProps = {
  className: '',
  tags: [],
  disabled: false,
  checkboxSelect: false,
  onChange: null,
  limitTags: 2,
  inputLabel: <FormattedMessage id="thread.audience.addressing.label" defaultMessage="thread.audience.addressing.label" />,
  variant: 'outlined',
  inputLabelBold: false,
  forcePopupIcon: false,
  size: 'medium'
};

Audience.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.array,
  tags: PropTypes.array,
  checkboxSelect: PropTypes.bool,
  onChange: PropTypes.func,
  limitTags: PropTypes.number,
  limitCountTags: PropTypes.number,
  inputLabel: PropTypes.node,
  variant: PropTypes.oneOf(['outlined', 'standard']),
  forcePopupIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),

  /* Translation */
  intl: PropTypes.object.isRequired
};

export default injectIntl(Audience);
