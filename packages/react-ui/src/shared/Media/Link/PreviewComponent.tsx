import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import {MEDIA_TYPE_VIDEO} from '../../../constants/Media';
import AutoPlayer from '../../AutoPlayer';
import CentralProgress from '../../CentralProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

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
  /**
   * Handles on media click
   */
  onMediaClick?: (any) => void;
}
export default (props: LinkPreviewProps): JSX.Element => {
  // PROPS
  const {medias, fullWidth = false, adornment = null, onMediaClick = null} = props;

  const handleLinkClick = (link) => {
    onMediaClick(link);
  };

  /**
   * Renders link preview
   * @param (link)
   * @param(key)
   */
  const renderPreview = (link, key) => {
    return (
      <Box className={classes.preview} key={key}>
        {link.embed.metadata.images.length > 0 && (
          <Box>
            {fullWidth ? (
              <img src={link.embed.metadata.images[0].url} className={classes.image} />
            ) : (
              <Box className={classes.thumbnail}>
                <img src={link.embed.metadata.images[0].url} className={classes.image} />
              </Box>
            )}
          </Box>
        )}
        <Box className={classes.snippet}>
          <b className={classes.snippetTitle}>{link.embed.metadata.title}</b>
          <br />
          <p className={classes.snippetDescription}>{link.embed.metadata.description}</p>
          <a href={link.embed.metadata.url} target={'_blank'} onClick={() => handleLinkClick(link)}>
            {link.embed.metadata.url}
          </a>
        </Box>
        <div style={{clear: 'both'}}></div>
      </Box>
    );
  };

  /**
   * Renders component
   */
  return (
    <>
      {medias.length > 0 && (
        <LazyLoad height={450} placeholder={<Skeleton animation="wave" variant="rectangular" width={'100%'} height={450} />} once>
          <Root>
            {adornment}
            {medias.map((l, i) => {
              if (l.embed.metadata && l.embed.metadata.type === MEDIA_TYPE_VIDEO) {
                return <AutoPlayer url={l.url} width={'100%'} key={i} onVideoWatch={() => handleLinkClick(l)} />;
              }
              return renderPreview(l, i);
            })}
          </Root>
        </LazyLoad>
      )}
    </>
  );
};
