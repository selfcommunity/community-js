import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import Box from '@mui/material/Box';
import AutoPlayer from '../../AutoPlayer';
import {DEFAULT_PRELOAD_OFFSET_VIEWPORT} from '../../../constants/LazyLoad';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCPreviewMediaVideo';

const classes = {
  previewVideo: `${PREFIX}-preview-video`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.previewVideo}`]: {
    minHeight: 360
  }
}));

export interface PreviewVideoProps {
  /**
   * Medias
   * @default []
   */
  medias: any[];
  /**
   * Component adornments
   * @default null
   */
  adornment?: React.ReactNode;
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}
export default (props: PreviewVideoProps): JSX.Element => {
  // PROPS
  const {medias = [], adornment = null, onMediaClick} = props;

  const handleVideoClick = (link) => {
    onMediaClick(link);
  };

  /**
   * Renders Video preview
   */
  return (
    <>
      {medias.length > 0 && (
        <Root>
          {adornment}
          {medias.map((v, i) => (
            <LazyLoad
              height={360}
              placeholder={<Skeleton variant="rectangular" height={360} width={'100%'} />}
              key={i}
              once
              className={classes.previewVideo}
              offset={DEFAULT_PRELOAD_OFFSET_VIEWPORT}>
              <AutoPlayer url={v.url} width={'100%'} onVideoWatch={() => handleVideoClick(v)} />
            </LazyLoad>
          ))}
        </Root>
      )}
    </>
  );
};
