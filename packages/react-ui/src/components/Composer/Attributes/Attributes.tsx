import React, {useCallback} from 'react';
import {Box, BoxProps, Chip, styled, Icon} from '@mui/material';
import {SCCategoryType, SCTagType, SCUserAutocompleteType} from '@selfcommunity/types';
import classNames from 'classnames';
import TagChip from '../../../shared/TagChip';
import {ComposerContentType} from '../../../types/composer';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-attributes-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'AttributesRoot'
})(() => ({}));

export interface AttributesProps extends Omit<BoxProps, 'value' | 'onChange' | 'onClick'> {
  /**
   * Value of the component
   */
  value?: Omit<ComposerContentType, 'title' | 'html'> | null;

  /**
   * Callback for change event on attributes object
   * @param value
   * @default empty object
   */
  onChange?: (value: Omit<ComposerContentType, 'title' | 'html'>) => void;

  /**
   * Callback for click event on single attribute
   * @param value
   * @default empty object
   */
  onClick?: (attribute: 'categories' | 'event' | 'group' | 'addressing' | 'location' | 'recipients') => void;
}

export default (props: AttributesProps): JSX.Element => {
  // PROPS
  const {className = null, value = null, onChange = null, onClick = null} = props;

  // HANDLERS
  const handleDeleteCategory = useCallback(
    (id: number) => () => {
      onChange && onChange({...value, categories: value.categories.filter((cat: SCCategoryType) => cat.id !== id)});
    },
    [value, onChange]
  );
  const handleClickCategory = useCallback(() => {
    onClick && onClick('categories');
  }, [onClick]);

  const handleDeleteEvent = useCallback(() => {
    onChange && onChange({...value, event: null});
  }, [value, onChange]);

  const handleClickEvent = useCallback(() => {
    onClick && onClick('event');
  }, [onClick]);

  const handleDeleteGroup = useCallback(() => {
    onChange && onChange({...value, group: null});
  }, [value, onChange]);

  const handleClickGroup = useCallback(() => {
    onClick && onClick('group');
  }, [onClick]);

  const handleDeleteTag = useCallback(
    (id: number) => () => {
      onChange && onChange({...value, addressing: value.addressing.filter((tag: SCTagType) => tag.id !== id)});
    },
    [value, onChange]
  );
  const handleClickTag = useCallback(() => {
    onClick && onClick('addressing');
  }, [onClick]);
  const handleDeleteLocation = useCallback(() => {
    onChange && onChange({...value, location: null});
  }, [value, onChange]);
  const handleClickLocation = useCallback(() => {
    onClick && onClick('location');
  }, [onClick]);
  const handleDeleteRecipient = useCallback(
    (identifier: number | string) => () => {
      if (!value?.recipients) return;
      onChange &&
        onChange({
          ...value,
          recipients: value.recipients.filter((r: SCUserAutocompleteType | string) =>
            typeof r === 'object' ? r.id !== identifier : r !== identifier
          )
        });
    },
    [value, onChange]
  );
  const handleClickRecipient = useCallback(() => {
    onClick && onClick('recipients');
  }, [onClick]);

  return (
    <Root className={classNames(classes.root, className)}>
      {value?.categories?.length > 0 &&
        value?.categories.map((c: SCCategoryType) => (
          <Chip key={c.id} label={c.name} onDelete={handleDeleteCategory(c.id)} icon={<Icon>category</Icon>} onClick={handleClickCategory} />
        ))}
      {value?.group && (
        <Chip
          key={value?.group.id}
          label={value?.group.name}
          onDelete={handleDeleteGroup}
          icon={<Icon>groups</Icon>}
          onClick={handleClickGroup}
          disabled={!value?.group?.subscription_status}
        />
      )}
      {value?.event && (
        <Chip
          key={value?.event.id}
          label={value?.event.name}
          onDelete={handleDeleteEvent}
          icon={<Icon>CalendarIcon</Icon>}
          onClick={handleClickEvent}
          disabled={!value?.event?.subscription_status}
        />
      )}
      {value?.addressing?.length > 0 &&
        value?.addressing.map((t: SCTagType) => (
          <TagChip key={t.id} tag={t} onDelete={handleDeleteTag(t.id)} icon={<Icon>label</Icon>} onClick={handleClickTag} showDescription />
        ))}
      <>
        {value?.recipients?.length > 0 && (
          <>
            {value.recipients.slice(0, 3).map((r: SCUserAutocompleteType) => (
              <Chip
                key={typeof r === 'object' ? r.id : r}
                label={typeof r === 'object' ? r.username : r}
                icon={<Icon>people_alt</Icon>}
                onClick={handleClickRecipient}
                onDelete={handleDeleteRecipient(typeof r === 'object' ? r.id : r)}
              />
            ))}
            {value.recipients.length > 3 && <Chip label={`+${value.recipients.length - 3}`} onClick={handleClickRecipient} />}
          </>
        )}
      </>
      {value?.location && (
        <Chip icon={<Icon>add_location_alt</Icon>} label={value?.location.location} onDelete={handleDeleteLocation} onClick={handleClickLocation} />
      )}
    </Root>
  );
};
