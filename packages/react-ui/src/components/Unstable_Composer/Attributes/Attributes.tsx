import React, { useCallback } from 'react';
import { Box, BoxProps, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import itLocale from 'date-fns/locale/it';
import enLocale from 'date-fns/locale/en-US';
import { SCCategoryType, SCTagType } from '@selfcommunity/types/src/index';
import classNames from 'classnames';
import { useThemeProps } from '@mui/system';
import TagChip from '../../../shared/TagChip';
import { ComposerContentType } from '../../../types/composer';

const localeMap = {
  en: enLocale,
  it: itLocale
};

const PREFIX = 'UnstableSCComposerAttributes';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
  onClick?: (attribute: 'categories' | 'addressing') => void;
}

export default (inProps: AttributesProps): JSX.Element => {
  // PROPS
  const props: AttributesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, value = null, onChange = null, onClick = null} = props;

  // HANDLERS
  const handleDeleteCategory = useCallback((id: number) => () => {
    onChange && onChange({...value, categories: value.categories.filter((cat: SCCategoryType) => cat.id !== id)})
  }, [value, onChange]);
  const handleClickCategory = useCallback(() => {
    onClick && onClick('categories');
  }, [onClick]);
  const handleDeleteTag = useCallback((id: number) => () => {
    onChange && onChange({...value, addressing: value.addressing.filter((tag: SCTagType) => tag.id !== id)})
  }, [value, onChange]);
  const handleClickTag = useCallback(() => {
    onClick && onClick('addressing');
  }, [onClick]);

  return (
    <Root className={classNames(classes.root, className)}>
      {value?.categories?.length > 0 &&
        value?.categories.map((c: SCCategoryType) => (
          <Chip key={c.id} label={c.name} onDelete={handleDeleteCategory(c.id)} icon={<Icon>category</Icon>} onClick={handleClickCategory} />
        ))}
      {value?.addressing?.length > 0 &&
        value?.addressing.map((t: SCTagType) => (
          <TagChip key={t.id} tag={t} onDelete={handleDeleteTag(t.id)} icon={<Icon>label</Icon>} onClick={handleClickTag} />
        ))}
      {value?.location && (
        <Chip
          icon={<Icon>add_location_alt</Icon>}
          label={value?.location.location}
          onDelete={() => null}
          onClick={() => null}
        />
      )}
    </Root>
  );
};
