import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import {MEDIA_TYPE_VIDEO} from '../../../../constants/Media';
import AutoPlayer from '../AutoPlayer';
import CentralProgress from '../../../../shared/CentralProgress';
import Box from '@mui/material/Box';

const PREFIX = 'SCPostMediaLink';

const classes = {
  preview: `${PREFIX}-preview`,
  thumbnail: `${PREFIX}-thumbnail`,
  image: `${PREFIX}-image`,
  snippet: `${PREFIX}-snippet`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
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
    '& p': {
      fontSize: 12
    },
    '& a': {
      fontSize: 13,
      fontStyle: 'italic'
    }
  }
}));

export default function Link({media, fullWidth = false}: {media: any; fullWidth?: boolean}): JSX.Element {
  const renderPreview = () => {
    if (fullWidth) {
      return (
        <div className={classes.preview}>
          <img src={media.embed.metadata.images[0].url} className={classes.image} />
          <div className={classes.snippet}>
            <b>{media.embed.metadata.title}</b>
            <br />
            <p>{media.embed.metadata.description}</p>
            <a href={media.embed.metadata.url} target={'_blank'}>
              {media.embed.metadata.url}
            </a>
          </div>
          <div style={{clear: 'both'}}></div>
        </div>
      );
    }

    return (
      <div className={classes.preview}>
        <div className={classes.thumbnail}>
          <img src={media.embed.metadata.images[0].url} className={classes.image} />
        </div>
        <div className={classes.snippet}>
          <b>{media.embed.metadata.title}</b>
          <br />
          <p>{media.embed.metadata.description}</p>
          <a href={media.embed.metadata.url} target={'_blank'}>
            {media.embed.metadata.url}
          </a>
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    );
  };

  return (
    <LazyLoad height={360} placeholder={<CentralProgress size={20} />} once>
      <Root>
        {media.embed.metadata && media.embed.metadata.type === MEDIA_TYPE_VIDEO ? <AutoPlayer url={media.url} width={'100%'} /> : renderPreview()}
      </Root>
    </LazyLoad>
  );
}
