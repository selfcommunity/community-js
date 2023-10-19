import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, BoxProps, Button, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SCMediaType } from '@selfcommunity/types/src/index';
import { useThemeProps } from '@mui/system';
import Icon from '@mui/material/Icon';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';
import { ComposerLayerProps } from '../../../types/composer';
import { PREFIX } from './constants';
import PreviewComponent from './PreviewComponent';
import UrlTextField from './UrlTextField';
import filter from './filter';

const classes = {
  layerRoot: `${PREFIX}-layer-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`,
  media: `${PREFIX}-media`,
  delete: `${PREFIX}-delete`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerRoot'
})(() => ({}));

export interface LayerComponentProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {
  defaultValue: SCMediaType[];
}

const LayerComponent = React.forwardRef((props: LayerComponentProps, ref: React.Ref<unknown>): ReactElement => {
  // PROPS
  const {className, onClose, onSave, defaultValue= [], ...rest} = props;

  // STATE
  const [value, setValue] = useState<SCMediaType[]>(defaultValue);

  // HANDLERS
  const handleSave = useCallback(() => onSave(value), [value]);
  const handleAdd = useCallback((media: SCMediaType) => setValue([...value, media]), [value]);
  const handleChange = useCallback((medias: SCMediaType[]) => setValue(medias), []);

  return <Root ref={ref} className={classNames(className, classes.layerRoot)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.media.link.layer.title" defaultMessage="ui.unstable_composer.media.link.layer.title" />
      </Typography>
      <Button size="small" color="primary" variant="contained" onClick={handleSave}>
        <FormattedMessage id="ui.unstable_composer.layer.save" defaultMessage="ui.unstable_composer.layer.save" />
      </Button>
    </DialogTitle>
    <DialogContent className={classes.content}>
      <UrlTextField
        id="page"
        name="page"
        label={<FormattedMessage id="ui.composer.media.link.add.label" defaultMessage="ui.composer.media.link.add.label" />}
        fullWidth
        variant="outlined"
        placeholder="https://"
        onSuccess={handleAdd}
      />
      <PreviewComponent onChange={handleChange} value={value} />
    </DialogContent>
  </Root>
});

export default LayerComponent;
