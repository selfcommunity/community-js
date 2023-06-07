import React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import FeedObject from '../../../components/FeedObject';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import {CacheStrategies} from '@selfcommunity/utils';

const PREFIX = 'SCPreviewMediaShare';

const classes = {
  sharePreview: `${PREFIX}-share-preview`,
  sharePlaceholder: `${PREFIX}-share-placeholder`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.sharePreview}`]: {
    padding: 16
  },
  [`& .${classes.sharePlaceholder}`]: {
    margin: 16
  }
}));

export default ({medias = [], adornment = null}: {medias: any[]; GridImageProps?: any; adornment?: React.ReactNode}): JSX.Element => {
  return (
    <>
      {medias.length > 0 && (
        <Root>
          {adornment}
          {medias.map((media, i) => (
            <Box className={classes.sharePreview} key={i}>
              <FeedObject
                feedObjectId={media.embed.metadata.id}
                feedObjectType={media.embed.metadata.type}
                variant={'outlined'}
                template={SCFeedObjectTemplateType.SHARE}
                cacheStrategy={CacheStrategies.CACHE_FIRST}
              />
            </Box>
          ))}
        </Root>
      )}
    </>
  );
};
