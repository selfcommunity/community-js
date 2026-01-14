import {ReactElement, useMemo} from 'react';
import FeedObject from '../../../components/FeedObject';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import {CacheStrategies} from '@selfcommunity/utils';
import {SCEventType, SCMediaType} from '@selfcommunity/types/src/types';
import classNames from 'classnames';
import {BoxProps, styled, Box} from '@mui/material';
import filter from './filter';
import {PREFIX} from './constants';
import {MEDIA_EMBED_SC_SHARED_EVENT, MEDIA_TYPE_EVENT} from '../../../constants/Media';
import {SCEventTemplateType} from '../../../types/event';
import Event from '../../../components/Event';

const classes = {
  displayRoot: `${PREFIX}-display-root`,
  sharePreview: `${PREFIX}-share-preview`,
  sharePlaceholder: `${PREFIX}-share-placeholder`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'DisplayRoot'
})(() => ({}));

export interface DisplayComponentProps extends BoxProps {
  /**
   * Medias
   */
  medias: SCMediaType[];
}

export default ({className, medias = [], ...rest}: DisplayComponentProps): ReactElement => {
  // MEMO
  const _medias = useMemo(() => medias.filter(filter), [medias]);
  if (_medias.length === 0) {
    return null;
  }

  return (
    <Root className={classNames(className, classes.displayRoot)} {...rest}>
      {_medias.map((media, i) => (
        <Box className={classes.sharePreview} key={i}>
          {media.type === MEDIA_TYPE_EVENT || (media.embed && media.embed.embed_type === MEDIA_EMBED_SC_SHARED_EVENT) ? (
            <Event
              event={media.embed.metadata as SCEventType}
              template={SCEventTemplateType.DETAIL}
              variant="outlined"
              square={true}
              hideEventParticipants
              hideEventPlanner
              actions={<></>}
            />
          ) : (
            <FeedObject
              feedObjectId={media.embed.metadata.id}
              feedObjectType={media.embed.metadata.type}
              variant="outlined"
              template={SCFeedObjectTemplateType.SHARE}
              cacheStrategy={CacheStrategies.CACHE_FIRST}
            />
          )}
        </Box>
      ))}
    </Root>
  );
};
