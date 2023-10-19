import React, { ReactElement, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, BoxProps, Button, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCContributionLocation } from '@selfcommunity/types/src/index';
import { ComposerLayerProps } from '../../../../types/composer';
import Icon from '@mui/material/Icon';
import LocationAutocomplete from '../../../LocationAutocomplete';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';
import { PREFIX } from '../../constants';

const classes = {
  root: `${PREFIX}-layer-location-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerLocationRoot'
})(() => ({}));

export interface LocationLayerProps extends Omit<BoxProps, 'defaultValue'>, Omit<ComposerLayerProps, 'defaultValue'> {
  defaultValue: SCContributionLocation;
}

const LocationLayer = React.forwardRef((props: LocationLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {className, onClose, onSave, defaultValue= null, ...rest} = props;

  // STATE
  const [value, setValue] = useState<SCContributionLocation>(defaultValue);

  // HANDLERS
  const handleSave = useCallback(() => onSave(value), [value, onSave]);
  const handleChange = useCallback((location: SCContributionLocation) => setValue(location), []);

  return <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.layer.location.title" defaultMessage="ui.unstable_composer.layer.location.title" />
      </Typography>
      <Button size="small" color="secondary" variant="contained" onClick={handleSave}>
        <FormattedMessage id="ui.unstable_composer.layer.save" defaultMessage="ui.unstable_composer.layer.save" />
      </Button>
    </DialogTitle>
    <DialogContent className={classes.content}>
      <LocationAutocomplete
        onChange={handleChange}
        defaultValue={value ? value : ''}
      />
    </DialogContent>
  </Root>
});

export default LocationLayer;
