import React, { ReactElement, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, BoxProps, Button, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCCategoryType } from '@selfcommunity/types/src/index';
import { useThemeProps } from '@mui/system';
import { ComposerLayerProps } from '../../../../types/composer';
import Icon from '@mui/material/Icon';
import CategoryAutocomplete from '../../../CategoryAutocomplete';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';

const PREFIX = 'UnstableSCComposerCategoryLayer';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface CategoryLayerProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultValue: SCCategoryType[];
}

const CategoryLayer = React.forwardRef((inProps: CategoryLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const props: CategoryLayerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, onClose, onSave, defaultValue= [], ...rest} = props;

  // STATE
  const [value, setValue] = useState<SCCategoryType[]>(defaultValue);

  // HANDLERS
  const handleSave = useCallback(() => onSave(value), [value]);
  const handleChange = useCallback((categories: SCCategoryType[]) => setValue(categories), []);

  return <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.layer.category.title" defaultMessage="ui.unstable_composer.layer.category.title" />
      </Typography>
      <Button size="small" color="primary" variant="contained" onClick={handleSave}>
        <FormattedMessage id="ui.unstable_composer.layer.save" defaultMessage="ui.unstable_composer.layer.save" />
      </Button>
    </DialogTitle>
    <DialogContent className={classes.content}>
      <CategoryAutocomplete
        multiple
        onChange={handleChange}
        defaultValue={defaultValue}
      />
    </DialogContent>
  </Root>
});

export default CategoryLayer;
