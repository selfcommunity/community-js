import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import FeedObject from '../../../components/FeedObject';
import {SCFeedObjectTemplateType} from '../../../types/feedObject';
import {PRELOAD_OFFSET_VIEWPORT} from '../../../constants/LazyLoad';

const PREFIX = 'SCPreviewMediaShare';

const classes = {
  sharePreview: `${PREFIX}-share-preview`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.sharePreview}`]: {
    padding: 16
  }
}));

export default ({medias = [], adornment = null}: {medias: any[]; GridImageProps?: any; adornment?: React.ReactNode}): JSX.Element => {
  return (
    <>
      {medias.length > 0 && (
        <LazyLoad height={400} placeholder={<CentralProgress size={20} />} once offset={PRELOAD_OFFSET_VIEWPORT}>
          <Root>
            {adornment}
            {medias.map((media) => (
              <Box key={media.id} className={classes.sharePreview}>
                <FeedObject
                  feedObjectId={media.embed.metadata.id}
                  feedObjectType={media.embed.metadata.type}
                  variant={'outlined'}
                  template={SCFeedObjectTemplateType.SHARE}
                />
              </Box>
            ))}
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
