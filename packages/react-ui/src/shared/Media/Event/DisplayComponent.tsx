import React, {ReactElement, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import {SCMediaType} from '@selfcommunity/types/src/types';
import classNames from 'classnames';
import {BoxProps} from '@mui/material';
import filter from './filter';
import Event from '../../../components/Event';
import {SCEventTemplateType} from '../../../types/event';
import {SCEventType} from '@selfcommunity/types';
import {PREFIX} from './constants';

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
  console.log(medias);

  return (
    <Root className={classNames(className, classes.displayRoot)} {...rest}>
      {_medias.map((media, i) => (
        <Box className={classes.eventPreview} key={i} onClick={onMediaClick}>
          <Event
            event={media.embed.metadata as SCEventType}
            template={SCEventTemplateType.DETAIL}
            variant="outlined"
            square={true}
            hideEventParticipants
            hideEventPlanner
            actions={<></>}
          />
        </Box>
      ))}
    </Root>
  );
};
