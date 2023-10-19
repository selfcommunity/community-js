import React, { ReactElement, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, BoxProps, Button, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCCategoryType } from '@selfcommunity/types/src/index';
import { ComposerLayerProps } from '../../../../types/composer';
import Icon from '@mui/material/Icon';
import CategoryAutocomplete from '../../../CategoryAutocomplete';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';
import { PREFIX } from '../../constants';

const classes = {
  root: `${PREFIX}-layer-category-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerCategoryRoot'
})(() => ({}));

export interface CategoryLayerProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultValue: SCCategoryType[];
}

const CategoryLayer = React.forwardRef((props: CategoryLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {className, onClose, onSave, defaultValue= [], ...rest} = props;

  // STATE
  const [value, setValue] = useState<SCCategoryType[]>(defaultValue);

  // HANDLERS
  const handleSave = useCallback(() => onSave(value), [value, onSave]);
  const handleChange = useCallback((categories: SCCategoryType[]) => setValue(categories), []);

  return <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.composer.layer.category.title" defaultMessage="ui.composer.layer.category.title" />
      </Typography>
      <Button size="small" color="secondary" variant="contained" onClick={handleSave}>
        <FormattedMessage id="ui.composer.layer.save" defaultMessage="ui.composer.layer.save" />
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
