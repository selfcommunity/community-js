import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import AutoPlayer from '../../AutoPlayer';

const PREFIX = 'SCPreviewMediaVideo';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
            <LazyLoad height={360} placeholder={<CentralProgress size={20} />} key={i} once>
              <AutoPlayer url={v.url} width={'100%'} onVideoWatch={() => handleVideoClick(v)} />
            </LazyLoad>
          ))}
        </Root>
      )}
    </>
  );
};
