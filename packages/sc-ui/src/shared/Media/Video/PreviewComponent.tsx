import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import Image from '../Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {MAX_GRID_IMAGES} from '../../../constants/Media';

const PREFIX = 'SCMediaDocument';

const classes = {
  preview: `${PREFIX}-preview`,
  thumbnail: `${PREFIX}-thumbnail`,
  image: `${PREFIX}-image`,
  snippet: `${PREFIX}-snippet`,
  snippetTitle: `${PREFIX}-snippetTitle`,
  snippetDescription: `${PREFIX}-snippetDescription`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.preview}`]: {
    position: 'relative'
  },

  [`& .${classes.thumbnail}`]: {
    maxWidth: 180,
    border: '1px solid #dddddd',
    borderRadius: 4,
    margin: '10px 10px 40px 10px',
    padding: 4,
    float: 'left'
  },

  [`& .${classes.image}`]: {
    width: '100%'
  },

  [`& .${classes.snippet}`]: {
    padding: 7,
    backgroundColor: '#F5F5F5',
    [`& .${classes.snippetTitle}`]: {},
    [`& .${classes.snippetDescription}`]: {
      fontSize: 12
    },
    '& a': {
      fontSize: 13,
      fontStyle: 'italic'
    }
  }
}));

export default ({
  medias = [],
  GridImageProps = {},
  adornment = null
}: {
  medias: any[];
  GridImageProps?: any;
  adornment?: React.ReactNode;
}): JSX.Element => {
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

  const renderPreview = () => {
    return (
      <Image.previewComponent
        images={medias}
        title
        renderOverlay={() => <ZoomInIcon />}
        onClickEach={handleClickOnPdf}
        {...GridImageProps}
        adornment={adornment}
      />
    );
  };

  return (
    <LazyLoad height={360} placeholder={<CentralProgress size={20} />} once>
      <Root>{renderPreview()}</Root>
    </LazyLoad>
  );
};
