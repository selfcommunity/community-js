import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import Image from '../Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {MAX_GRID_IMAGES} from '../../../constants/Media';

const PREFIX = 'SCPreviewMediaDocument';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default ({
  medias = [],
  GridImageProps = {},
  adornment = null
}: {
  medias: any[];
  GridImageProps?: any;
  adornment?: React.ReactNode;
}): JSX.Element => {
  /**
   * Handle click on pdf
   * @param doc
   */
  const handleClickOnPdf = (doc) => {
    if (doc && doc.index >= MAX_GRID_IMAGES - 1) {
      // Open the post/discussion
      // history.push(url(threadType, {id: thread.id, slug: thread.slug})());
    } else if (doc.src && doc.src.url) {
      // Open file in target blank
      let win = window.open(doc.src.url, '_blank');
      win.focus();
    }
  };

  return (
    <>
      {medias.length > 0 && (
        <LazyLoad height={360} placeholder={<CentralProgress size={20} />}>
          <Root>
            {adornment}
            <Image.previewComponent
              medias={medias}
              title
              renderOverlay={() => <ZoomInIcon />}
              onClickEach={handleClickOnPdf}
              {...GridImageProps}
              adornment={adornment}
            />
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
