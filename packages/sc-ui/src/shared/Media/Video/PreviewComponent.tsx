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

export default ({medias = [], adornment = null}: {medias: any[]; adornment?: React.ReactNode}): JSX.Element => {
  return (
    <>
      {medias.length > 0 && (
        <LazyLoad height={360} placeholder={<CentralProgress size={20} />} once>
          <Root>
            {adornment}
            {medias.map((v, i) => (
              <LazyLoad height={360} placeholder={<CentralProgress size={20} />} key={i} once>
                <AutoPlayer url={v.url} width={'100%'} />
              </LazyLoad>
            ))}
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
