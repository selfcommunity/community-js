import React, {ReactElement, SyntheticEvent, useCallback, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {
  Autocomplete,
  Box,
  BoxProps,
  Button,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography,
  styled,
  TextField,
  TextFieldProps,
  DialogContent,
  Icon
} from '@mui/material';
import {SCTagType} from '@selfcommunity/types';
import TagChip from '../../../../shared/TagChip';
import {ComposerLayerProps} from '../../../../types/composer';
import classNames from 'classnames';
import {SCPreferences, SCPreferencesContextType, useSCFetchAddressingTagList, useSCPreferences} from '@selfcommunity/react-core';
import {PREFIX} from '../../constants';
import GroupAutocomplete from '../../../GroupAutocomplete';
import {SCGroupType, SCFeatureName, SCEventType} from '@selfcommunity/types';
import EventAutocomplete from '../../../EventAutocomplete';
import UserAutocomplete from '../../../UserAutocomplete';

export enum AudienceTypes {
  AUDIENCE_ALL = 'all',
  AUDIENCE_TAG = 'tag',
  AUDIENCE_GROUP = 'group',
  AUDIENCE_EVENT = 'event',
  AUDIENCE_USERS = 'users'
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
  defaultValue: SCTagType[] | SCGroupType | any;
  TextFieldProps?: TextFieldProps;
}

const AudienceLayer = React.forwardRef((props: AudienceLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {
    className,
    onClose,
    onSave,
    defaultValue = AudienceTypes.AUDIENCE_TAG || AudienceTypes.AUDIENCE_USERS ? [] : null,
    TextFieldProps = {
      variant: 'outlined',
      label: <FormattedMessage id="ui.composer.layer.audience.tags.label" defaultMessage="ui.composer.layer.audience.tags.label" />
    },
    ...rest
  } = props;

  // STATE
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [value, setValue] = useState<SCTagType[] | SCGroupType | any>(defaultValue || undefined);

  // HOOKS
  const {scAddressingTags} = useSCFetchAddressingTagList({fetch: autocompleteOpen});
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  // MEMO
  const groupsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.GROUPING) &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value,
    [preferences, features]
  );
  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );
  const usersTaggingEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_POST_USER_ADDRESSING_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_POST_USER_ADDRESSING_ENABLED].value,
    [preferences, features]
  );
  const taggingRequiredEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      SCPreferences.CONFIGURATIONS_POST_ADDRESSING_REQUIRED_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_POST_ADDRESSING_REQUIRED_ENABLED].value,
    [preferences, features]
  );

  const [audience, setAudience] = useState<AudienceTypes>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    defaultValue === null || defaultValue.length === 0
      ? taggingRequiredEnabled
        ? AudienceTypes.AUDIENCE_TAG
        : AudienceTypes.AUDIENCE_ALL
      : Object.prototype.hasOwnProperty.call(defaultValue, 'recurring')
      ? AudienceTypes.AUDIENCE_EVENT
      : Object.prototype.hasOwnProperty.call(defaultValue, 'managed_by')
      ? AudienceTypes.AUDIENCE_GROUP
      : Array.isArray(defaultValue) && defaultValue.length > 0 && defaultValue[0]?.username !== undefined
      ? AudienceTypes.AUDIENCE_USERS
      : AudienceTypes.AUDIENCE_TAG
  );

  // HANDLERS
  const handleSave = useCallback(() => {
    if (audience === AudienceTypes.AUDIENCE_GROUP || audience === AudienceTypes.AUDIENCE_EVENT) {
      onSave(value);
    } else {
      onSave(value?.length && value?.length > 0 ? value : null);
    }
  }, [audience, value, onSave]);

  const handleChange = useCallback((_event: SyntheticEvent, tags: SCTagType[]) => setValue(tags), []);
  const handleEventChange = useCallback((event: SCEventType) => setValue(event), []);
  const handleGroupChange = useCallback((group: SCGroupType) => setValue(group), []);
  const handleUsersChange = useCallback((users: any[]) => setValue(users), []);

  const handleChangeAudience = useCallback((_event: SyntheticEvent, data: AudienceTypes) => setAudience(data), []);
  const handleAutocompleteOpen = useCallback(() => setAutocompleteOpen(true), []);
  const handleAutocompleteClose = useCallback(() => setAutocompleteOpen(false), []);

  const isAudienceTypeSelected = (type: AudienceTypes) => {
    // "ALL" tab is never disabled
    if (type === AudienceTypes.AUDIENCE_ALL) return false;
    // Empty value → nothing is disabled
    if (!value || (Array.isArray(value) && value.length === 0)) return false;

    const valueType = (() => {
      if (Array.isArray(value)) {
        if (value.some((v) => 'color' in v)) return AudienceTypes.AUDIENCE_TAG;
        return AudienceTypes.AUDIENCE_USERS;
      } else {
        if ('recurring' in value) return AudienceTypes.AUDIENCE_EVENT;
        if ('managed_by' in value) return AudienceTypes.AUDIENCE_GROUP;
        return AudienceTypes.AUDIENCE_USERS;
      }
    })();
    // Disable all tabs except the currently selected type
    return type !== valueType;
  };

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
          {!taggingRequiredEnabled && (
            <Tab
              value={AudienceTypes.AUDIENCE_ALL}
              icon={<Icon>public</Icon>}
              label={<FormattedMessage id="ui.composer.layer.audience.all" defaultMessage="ui.composer.layer.audience.all" />}
            />
          )}
          {eventsEnabled && (
            <Tab
              disabled={isAudienceTypeSelected(AudienceTypes.AUDIENCE_EVENT)}
              value={AudienceTypes.AUDIENCE_EVENT}
              icon={<Icon>CalendarIcon</Icon>}
              label={<FormattedMessage id="ui.composer.layer.audience.event" defaultMessage="ui.composer.layer.audience.event" />}
            />
          )}
          {groupsEnabled && (
            <Tab
              disabled={isAudienceTypeSelected(AudienceTypes.AUDIENCE_GROUP)}
              value={AudienceTypes.AUDIENCE_GROUP}
              icon={<Icon>groups</Icon>}
              label={<FormattedMessage id="ui.composer.layer.audience.group" defaultMessage="ui.composer.layer.audience.group" />}
            />
          )}
          <Tab
            disabled={isAudienceTypeSelected(AudienceTypes.AUDIENCE_TAG)}
            value={AudienceTypes.AUDIENCE_TAG}
            icon={<Icon>label</Icon>}
            label={<FormattedMessage id="ui.composer.layer.audience.tag" defaultMessage="ui.composer.layer.audience.tag" />}
          />
          {usersTaggingEnabled && (
            <Tab
              disabled={isAudienceTypeSelected(AudienceTypes.AUDIENCE_USERS)}
              value={AudienceTypes.AUDIENCE_USERS}
              icon={<Icon>people_alt</Icon>}
              label={<FormattedMessage id="ui.composer.layer.audience.users" defaultMessage="ui.composer.layer.audience.users" />}
            />
          )}
        </Tabs>
        <Typography className={classes.message}>
          {audience === AudienceTypes.AUDIENCE_ALL && !taggingRequiredEnabled && (
            <FormattedMessage id="ui.composer.layer.audience.all.message" defaultMessage="ui.composer.layer.audience.all.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_EVENT && (
            <FormattedMessage id="ui.composer.layer.audience.event.message" defaultMessage="ui.composer.layer.audience.event.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_GROUP && (
            <FormattedMessage id="ui.composer.layer.audience.group.message" defaultMessage="ui.composer.layer.audience.group.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_TAG && (
            <FormattedMessage id="ui.composer.layer.audience.tag.message" defaultMessage="ui.composer.layer.audience.tag.message" />
          )}
          {audience === AudienceTypes.AUDIENCE_USERS && (
            <FormattedMessage id="ui.composer.layer.audience.users.message" defaultMessage="ui.composer.layer.audience.users.message" />
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
            value={value}
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
                    disposable={false}
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
        {audience === AudienceTypes.AUDIENCE_USERS && <UserAutocomplete onChange={handleUsersChange} defaultValue={value} />}
        {audience === AudienceTypes.AUDIENCE_GROUP && <GroupAutocomplete onChange={handleGroupChange} defaultValue={value} />}
        {audience === AudienceTypes.AUDIENCE_EVENT && <EventAutocomplete onChange={handleEventChange} defaultValue={value} />}
      </DialogContent>
    </Root>
  );
});

export default AudienceLayer;
