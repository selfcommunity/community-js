import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import {MEDIA_TYPE_VIDEO} from '../../../constants/Media';
import AutoPlayer from '../../AutoPlayer';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';

const PREFIX = 'SCPreviewMediaLink';

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
    position: 'relative',
    backgroundColor: '#F5F5F5',
    margin: '10px 0px'
  },

  [`& .${classes.thumbnail}`]: {
    maxWidth: 150,
    border: '1px solid #dddddd',
    borderRadius: 4,
    margin: '10px 10px 10px 20px',
    padding: 4,
    float: 'left'
  },

  [`& .${classes.image}`]: {
    width: '100%'
  },

  [`& .${classes.snippet}`]: {
    padding: 10,
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
export interface LinkPreviewProps {
  /**
   * Medias
   */
  medias: any[];
  /**
   * Handle full width option
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Component adornments
   * @default null
   */
  adornment?: React.ReactNode;
}
export default (props: LinkPreviewProps): JSX.Element => {
  // PROPS
  const {medias, fullWidth = false, adornment = null} = props;

  /**
   * Renders link preview
   * @param (link)
   * @param(key)
   */
  const renderPreview = (link, key) => {
    if (fullWidth) {
      return (
        <div className={classes.preview} key={key}>
          <img src={link.embed.metadata.images[0].url} className={classes.image} />
          <div className={classes.snippet}>
            <b className={classes.snippetTitle}>{link.embed.metadata.title}</b>
            <br />
            <p className={classes.snippetDescription}>{link.embed.metadata.description}</p>
            <a href={link.embed.metadata.url} target={'_blank'}>
              {link.embed.metadata.url}
            </a>
          </div>
          <div style={{clear: 'both'}}></div>
        </div>
      );
    }

    return (
      <div className={classes.preview} key={key}>
        <div className={classes.thumbnail}>
          <img src={link.embed.metadata.images[0].url} className={classes.image} />
        </div>
        <div className={classes.snippet}>
          <b className={classes.snippetTitle}>{link.embed.metadata.title}</b>
          <br />
          <p className={classes.snippetDescription}>{link.embed.metadata.description}</p>
          <a href={link.embed.metadata.url} target={'_blank'}>
            {link.embed.metadata.url}
          </a>
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    );
  };

  /**
   * Renders component
   */
  return (
    <>
      {medias.length > 0 && (
        <LazyLoad height={360} placeholder={<CentralProgress size={20} />}>
          <Root>
            {adornment}
            {medias.map((l, i) => {
              if (l.embed.metadata && l.embed.metadata.type === MEDIA_TYPE_VIDEO) {
                return <AutoPlayer url={l.url} width={'100%'} key={i} />;
              }
              return renderPreview(l, i);
            })}
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
