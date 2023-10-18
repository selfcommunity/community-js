import React, { ReactElement, SyntheticEvent, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Autocomplete, Box, BoxProps, Button, DialogTitle, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCTagType } from '@selfcommunity/types/src/index';
import TagChip from '../../../../shared/TagChip';
import { ComposerLayerProps } from '../../../../types/composer';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';
import DialogContent from '@mui/material/DialogContent';
import { useSCFetchAddressingTagList } from '@selfcommunity/react-core';
import { PREFIX } from '../../constants';

const AUDIENCE_ALL = 'all';
const AUDIENCE_TAG = 'tag';

const classes = {
  root: `${PREFIX}-layer-audience-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`,
  message: `${PREFIX}-layer-audience-message`,
  autocomplete: `${PREFIX}-layer-audience-autocomplete`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerAudienceRoot'
})(() => ({}));

export interface AudienceLayerProps  extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultValue: SCTagType[];
  TextFieldProps?: TextFieldProps;
}

const AudienceLayer = React.forwardRef((props: AudienceLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {
    className,
    onClose,
    onSave,
    defaultValue= [],
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.unstable_composer.layer.audience.tags.label" defaultMessage="ui.unstable_composer.layer.audience.tags.label" />
    },
    ...rest} = props;

  // STATE
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [audience, setAudience] = useState<string>(defaultValue === null ? AUDIENCE_ALL : AUDIENCE_TAG);
  const [value, setValue] = useState<SCTagType[]>(defaultValue || undefined);

  // HOOKS
  const {scAddressingTags} = useSCFetchAddressingTagList({fetch: autocompleteOpen});

  // HANDLERS
  const handleSave = useCallback(() => onSave(value?.length && value?.length > 0 ? value : null), [value, onSave]);
  const handleChange = useCallback((event: SyntheticEvent, tags: SCTagType[]) => setValue(tags), []);

  const handleChangeAudience = useCallback((event: SyntheticEvent, data: string) => setAudience(data), []);
  const handleAutocompleteOpen = useCallback(() => setAutocompleteOpen(true), []);
  const handleAutocompleteClose = useCallback(() => setAutocompleteOpen(false), []);

  return <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.layer.audience.title" defaultMessage="ui.unstable_composer.layer.audience.title" />
      </Typography>
      <Button size="small" color="primary" variant="contained" onClick={handleSave}>
        <FormattedMessage id="ui.unstable_composer.layer.save" defaultMessage="ui.unstable_composer.layer.save" />
      </Button>
    </DialogTitle>
    <DialogContent className={classes.content}>
      <Tabs value={audience} onChange={handleChangeAudience} aria-label="audience type">
        <Tab
          value={AUDIENCE_ALL}
          icon={<Icon>public</Icon>}
          label={<FormattedMessage id="ui.unstable_composer.layer.audience.all" defaultMessage="ui.unstable_composer.layer.audience.all" />}
        />
        <Tab
          value={AUDIENCE_TAG}
          icon={<Icon>label</Icon>}
          label={<FormattedMessage id="ui.unstable_composer.layer.audience.tag" defaultMessage="ui.unstable_composer.layer.audience.tag" />}
        />
      </Tabs>
      <Typography className={classes.message}>
        {audience === AUDIENCE_ALL && (
          <FormattedMessage id="ui.unstable_composer.layer.audience.all.message" defaultMessage="ui.unstable_composer.audience.layer.all.message" />
        )}
        {audience === AUDIENCE_TAG && (
          <FormattedMessage id="ui.unstable_composer.layer.audience.tag.message" defaultMessage="ui.unstable_composer.audience.layer.tag.message" />
        )}
      </Typography>
      {audience === AUDIENCE_TAG && <Autocomplete
        className={classes.autocomplete}
        open={autocompleteOpen}
        onOpen={handleAutocompleteOpen}
        onClose={handleAutocompleteClose}
        multiple
        options={scAddressingTags || []}
        getOptionLabel={(option: SCTagType) => option.name || ''}
        value={value}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        clearIcon={null}
        noOptionsText={<FormattedMessage id="ui.unstable_composer.layer.audience.tags.empty" defaultMessage="ui.unstable_composer.layer.audience.tags.empty" />}
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
      />}
    </DialogContent>
  </Root>;
});

export default AudienceLayer;
