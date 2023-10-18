import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  BoxProps,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComposerLayerProps } from '../../../../types/composer';
import Icon from '@mui/material/Icon';
import DialogContent from '@mui/material/DialogContent';
import classNames from 'classnames';
import { PREFIX } from '../../constants';

const classes = {
  root: `${PREFIX}-layer-close-root`,
  title: `${PREFIX}-layer-title`,
  content: `${PREFIX}-layer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'LayerCloseRoot'
})(() => ({}));

export interface CloseLayerProps extends Omit<BoxProps, 'defaultValue'>, ComposerLayerProps {}

const CloseLayer = React.forwardRef((props: CloseLayerProps, ref: React.Ref<unknown>): ReactElement => {
  // Props
  const {className, onClose, onSave, defaultValue= [], ...rest} = props;

  return <Root ref={ref} className={classNames(className, classes.root)} {...rest}>
    <DialogTitle className={classes.title}>
      <IconButton onClick={onClose}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.layer.close.title" defaultMessage="ui.unstable_composer.layer.close.title" />
      </Typography>
    </DialogTitle>
    <DialogContent className={classes.content}>
      <Typography>
        <FormattedMessage id="ui.unstable_composer.layer.close.text" defaultMessage="ui.unstable_composer.layer.close.text" />
      </Typography>
      <List>
        <ListItem>
          <ListItemButton onClick={onClose}>
            <ListItemText primary={<FormattedMessage id="ui.unstable_composer.layer.close.no" defaultMessage="ui.unstable_composer.layer.close.no" />} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={onSave}>
            <ListItemText primary={<FormattedMessage id="ui.unstable_composer.layer.close.yes" defaultMessage="ui.unstable_composer.layer.close.yes" />} />
          </ListItemButton>
        </ListItem>
      </List>
    </DialogContent>
  </Root>
});

export default CloseLayer;
