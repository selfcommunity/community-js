import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import Box from '@mui/material/Box';
import FeedObject from '../../../components/FeedObject';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import {MAX_PRELOAD_OFFSET_VIEWPORT} from '../../../constants/LazyLoad';
import FeedObjectSkeleton from '../../../components/FeedObject/Skeleton';

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
          {medias.map((media) => (
            <LazyLoad
              height={400}
              key={media.id}
              placeholder={
                <FeedObjectSkeleton
                  template={SCFeedObjectTemplateType.SNIPPET}
                  elevation={0}
                  variant={'outlined'}
                  className={classes.sharePlaceholder}
                />
              }
              once
              offset={MAX_PRELOAD_OFFSET_VIEWPORT}>
              <Box className={classes.sharePreview}>
                <FeedObject
                  feedObjectId={media.embed.metadata.id}
                  feedObjectType={media.embed.metadata.type}
                  variant={'outlined'}
                  template={SCFeedObjectTemplateType.SHARE}
                />
              </Box>
            </LazyLoad>
          ))}
        </Root>
      )}
    </>
  );
};
