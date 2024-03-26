import React, {ReactElement, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {Box, BoxProps, Button, DialogTitle, IconButton, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {SCGroupType} from '@selfcommunity/types/src/index';
import {ComposerLayerProps} from '../../../../types/composer';
import Icon from '@mui/material/Icon';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';
import {PREFIX} from '../../constants';
import GroupAutocomplete from '../../../GroupAutocomplete';

const classes = {
  root: `${PREFIX}-layer-group-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerGroupRoot'
})(() => ({}));

export interface GroupLayerProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultValue: SCGroupType;
}

const GroupLayer = React.forwardRef((props: GroupLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {className, onClose, onSave, defaultValue = null, ...rest} = props;

  // STATE
  const [value, setValue] = useState<SCGroupType>(defaultValue);

  // HANDLERS
  const handleSave = useCallback(() => onSave(value), [value, onSave]);
  const handleChange = useCallback((group: SCGroupType) => setValue(group), []);

  return (
    <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
      <DialogTitle className={classes.title}>
        <IconButton onClick={onClose}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography>
          <FormattedMessage id="ui.composer.layer.group.title" defaultMessage="ui.composer.layer.group.title" />
        </Typography>
        <Button size="small" color="secondary" variant="contained" onClick={handleSave}>
          <FormattedMessage id="ui.composer.layer.save" defaultMessage="ui.composer.layer.save" />
        </Button>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <GroupAutocomplete onChange={handleChange} defaultValue={defaultValue} />
      </DialogContent>
    </Root>
  );
});

export default GroupLayer;
