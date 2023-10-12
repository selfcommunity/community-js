import React from 'react';
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

export interface AttributesProps extends Omit<BoxProps, 'value' | 'onChange'> {
  /**
   * Value of the component
   */
  value?: ComposerContentType | null;

  /**
   * Callback for change event on poll object
   * @param value
   * @default empty object
   */
  onChange: (value: ComposerContentType) => void;
}

export default (inProps: AttributesProps): JSX.Element => {
  // PROPS
  const props: AttributesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, value = null, onChange} = props;

  return (
    <Root className={classNames(classes.root, className)}>
      {value?.categories?.length > 0 &&
        value?.categories.map((c: SCCategoryType) => (
          <Chip key={c.id} label={c.name} onDelete={() => null} icon={<Icon>category</Icon>} onClick={() => null} />
        ))}
      {value?.addressing?.length > 0 &&
        value?.addressing.map((t: SCTagType) => (
          <TagChip key={t.id} tag={t} onDelete={() => null} icon={<Icon>label</Icon>} onClick={() => null} />
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
