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
import {Endpoints, http} from '@selfcommunity/core';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCThreadDialogCategories';

const Root = styled(Autocomplete, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  minWidth: 120
}));

class Categories extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.defaultValue,
      categories: [],
      open: false,
      isLoading: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  load(offset, limit) {
    offset = offset || 0;
    limit = limit || 20;
    http
      .request({
        url: Endpoints.CategoryList.url(),
        method: Endpoints.CategoryList.method,
        params: {
          offset,
          limit
        }
      })
      .then((res) => {
        this.setState({categories: res.data.results, isLoading: false});
        if (res.data.count > limit) {
          this.load(offset + res.data.results.length, res.data.count);
        }
      });
  }

  componentDidUpdate() {
    if (!this.state.isLoading && this.state.open && this.state.categories.length === 0) {
      this.load();
    }
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  handleChange(event, value) {
    const self = this;
    let newValue = null;
    if (self.props.limitCountCategories > 0) {
      const [...rest] = value;
      newValue = rest.slice(-1 * self.props.limitCountCategories);
    } else {
      newValue = value;
    }
    this.setState({value: newValue});
    this.props.onChange && this.props.onChange(newValue);
  }

  render() {
    const self = this;
    const {open} = this.state;
    return (
      <Root
        className={this.props.className}
        disabled={this.props.disabled}
        size={this.props.size}
        open={open}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        multiple
        limitTags={this.props.limitTags}
        options={this.state.categories || []}
        getOptionLabel={(option) => option.name || ''}
        value={this.state.value}
        filterSelectedOptions={!this.props.checkboxSelect}
        disableCloseOnSelect={this.props.checkboxSelect}
        forcePopupIcon={this.props.forcePopupIcon}
        selectOnFocus
        clearOnBlur
        blurOnSelect
        handleHomeEndKeys
        clearIcon={null}
        noOptionsText={<FormattedMessage id="thread.dialog.categories.empty" defaultMessage="thread.dialog.categories.empty" />}
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
              margin="dense"
              label={self.props.inputLabel}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'categories', // disable autocomplete and autofill
                endAdornment: (
                  <React.Fragment>
                    {self.state.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
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

Categories.defaultProps = {
  className: '',
  disabled: false,
  checkboxSelect: false,
  onChange: null,
  limitTags: 2,
  inputLabel: <FormattedMessage id="thread.dialog.categories.label" defaultMessage="thread.dialog.categories.label" />,
  variant: 'outlined',
  inputLabelBold: false,
  forcePopupIcon: false,
  size: 'medium'
};

Categories.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.array,
  checkboxSelect: PropTypes.bool,
  onChange: PropTypes.func,
  limitTags: PropTypes.number,
  limitCountCategories: PropTypes.number,
  inputLabel: PropTypes.node,
  variant: PropTypes.oneOf(['outlined', 'standard']),
  forcePopupIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),

  /* Translation */
  intl: PropTypes.object.isRequired
};

export default injectIntl(Categories);
