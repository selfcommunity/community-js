import React, {ReactElement, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import FeedObject from '../../../components/FeedObject';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import {CacheStrategies} from '@selfcommunity/utils';
import {SCMediaType} from '@selfcommunity/types/src/types';
import classNames from 'classnames';
import {BoxProps, CardMedia, Typography} from '@mui/material';
import filter from './filter';
import {PREFIX} from './constants';
import {FormattedMessage} from 'react-intl';
import Calendar from '../../Calendar';
import EventInfoDetails from '../../EventInfoDetails';

const classes = {
  displayRoot: `${PREFIX}-display-root`,
  eventPreview: `${PREFIX}-event-preview`,
  eventPlaceholder: `${PREFIX}-event-placeholder`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'DisplayRoot'
})(({theme}) => ({}));

export interface DisplayComponentProps extends BoxProps {
  /**
   * Medias
   */
  medias: SCMediaType[];
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}

export default ({className, medias = [], onMediaClick = null, ...rest}: DisplayComponentProps): ReactElement => {
  // MEMO
  const _medias = useMemo(() => medias.filter(filter), [medias]);
  if (_medias.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(className, classes.displayRoot)} {...rest}>
      {_medias.map((media, i) => (
        <Box className={classes.eventPreview} key={i} onClick={onMediaClick}>
          {/* Use Event card */}
          {media.title}
          {media.description}
        </Box>
      ))}
    </Root>
  );
};
