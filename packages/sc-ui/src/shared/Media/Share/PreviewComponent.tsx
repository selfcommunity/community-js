import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import FeedObject from '../../../components/FeedObject';
import {FeedObjectTemplateType} from '../../../types/feedObject';

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
        <LazyLoad height={360} placeholder={<CentralProgress size={20} />}>
          <Root>
            {adornment}
            {medias.map((media) => (
              <Box key={media.id} className={classes.sharePreview}>
                <FeedObject
                  feedObjectId={media.embed.metadata.id}
                  feedObjectType={media.embed.metadata.type}
                  variant={'outlined'}
                  template={FeedObjectTemplateType.SHARE}
                />
              </Box>
            ))}
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
