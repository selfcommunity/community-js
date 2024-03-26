import React, {ReactElement, SyntheticEvent, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import TextField, {TextFieldProps} from '@mui/material/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {Autocomplete, Box, BoxProps, Button, DialogTitle, IconButton, Tab, Tabs, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCTagType} from '@selfcommunity/types/src/index';
import TagChip from '../../../../shared/TagChip';
import {ComposerLayerProps} from '../../../../types/composer';
import classNames from 'classnames';
import Icon from '@mui/material/Icon';
import DialogContent from '@mui/material/DialogContent';
import {useSCFetchAddressingTagList} from '@selfcommunity/react-core';
import {PREFIX} from '../../constants';
import GroupAutocomplete from '../../../GroupAutocomplete';
import {SCGroupType} from '@selfcommunity/types';

export enum AudienceTypes {
  AUDIENCE_ALL = 'all',
  AUDIENCE_TAG = 'tag',
  AUDIENCE_GROUP = 'group'
}

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

export interface AudienceLayerProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultType: AudienceTypes;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultValue: SCTagType[] | SCGroupType;
  TextFieldProps?: TextFieldProps;
}

const AudienceLayer = React.forwardRef((props: AudienceLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {
    className,
    onClose,
    onSave,
    defaultType = AudienceTypes.AUDIENCE_TAG,
    defaultValue = AudienceTypes.AUDIENCE_TAG ? [] : null,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.composer.layer.audience.tags.label" defaultMessage="ui.composer.layer.audience.tags.label" />
    },
    ...rest
  } = props;

  // STATE
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [audience, setAudience] = useState<AudienceTypes>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    defaultValue === null || defaultValue.length === 0
      ? AudienceTypes.AUDIENCE_ALL
      : defaultType === AudienceTypes.AUDIENCE_GROUP
      ? AudienceTypes.AUDIENCE_GROUP
      : AudienceTypes.AUDIENCE_TAG
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [value, setValue] = useState<SCTagType[] | SCGroupType>(defaultValue || undefined);

  // HOOKS
  const {scAddressingTags} = useSCFetchAddressingTagList({fetch: autocompleteOpen});

  // HANDLERS
  const handleSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => (defaultType === AudienceTypes.AUDIENCE_GROUP ? onSave(value) : onSave(value?.length && value?.length > 0 ? value : null)),
    [value, onSave]
  );
  const handleChange = useCallback((event: SyntheticEvent, tags: SCTagType[]) => setValue(tags), []);
  const handleGroupChange = useCallback((group: SCGroupType) => setValue(group), []);

  const handleChangeAudience = useCallback((event: SyntheticEvent, data: AudienceTypes) => setAudience(data), []);
  const handleAutocompleteOpen = useCallback(() => setAutocompleteOpen(true), []);
  const handleAutocompleteClose = useCallback(() => setAutocompleteOpen(false), []);

  return (
    <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
      <DialogTitle className={classes.title}>
        <IconButton onClick={onClose}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography>
          <FormattedMessage id="ui.composer.layer.audience.title" defaultMessage="ui.composer.layer.audience.title" />
        </Typography>
        <Button size="small" color="secondary" variant="contained" onClick={handleSave}>
          <FormattedMessage id="ui.composer.layer.save" defaultMessage="ui.composer.layer.save" />
        </Button>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs value={audience} onChange={handleChangeAudience} aria-label="audience type">
          <Tab
            value={AudienceTypes.AUDIENCE_ALL}
            icon={<Icon>public</Icon>}
            label={<FormattedMessage id="ui.composer.layer.audience.all" defaultMessage="ui.composer.layer.audience.all" />}
          />
          <Tab
            disabled={defaultType === AudienceTypes.AUDIENCE_TAG}
            value={AudienceTypes.AUDIENCE_GROUP}
            icon={<Icon>groups</Icon>}
            label={<FormattedMessage id="ui.composer.layer.audience.group" defaultMessage="ui.composer.layer.audience.group" />}
          />
          <Tab
            disabled={defaultType === AudienceTypes.AUDIENCE_GROUP}
            value={AudienceTypes.AUDIENCE_TAG}
            icon={<Icon>label</Icon>}
            label={<FormattedMessage id="ui.composer.layer.audience.tag" defaultMessage="ui.composer.layer.audience.tag" />}
          />
        </Tabs>
        <Typography className={classes.message}>
          {audience === AudienceTypes.AUDIENCE_ALL && (
            <FormattedMessage id="ui.composer.layer.audience.all.message" defaultMessage="ui.composer.audience.layer.all.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_GROUP && (
            <FormattedMessage id="ui.composer.layer.audience.group.message" defaultMessage="ui.composer.audience.layer.group.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_TAG && (
            <FormattedMessage id="ui.composer.layer.audience.tag.message" defaultMessage="ui.composer.audience.layer.tag.message" />
          )}
        </Typography>
        {audience === AudienceTypes.AUDIENCE_TAG && (
          <Autocomplete
            className={classes.autocomplete}
            open={autocompleteOpen}
            onOpen={handleAutocompleteOpen}
            onClose={handleAutocompleteClose}
            multiple
            options={scAddressingTags || []}
            getOptionLabel={(option: SCTagType) => option.name || ''}
            value={value as any}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            clearIcon={null}
            noOptionsText={<FormattedMessage id="ui.composer.layer.audience.tags.empty" defaultMessage="ui.composer.layer.audience.tags.empty" />}
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
          />
        )}
        {audience === AudienceTypes.AUDIENCE_GROUP && <GroupAutocomplete onChange={handleGroupChange} defaultValue={defaultValue as any} />}
      </DialogContent>
    </Root>
  );
});

export default AudienceLayer;
