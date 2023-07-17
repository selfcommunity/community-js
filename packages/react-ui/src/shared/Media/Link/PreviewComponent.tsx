import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import {MEDIA_TYPE_VIDEO} from '../../../constants/Media';
import AutoPlayer from '../../AutoPlayer';
import Box from '@mui/material/Box';
import {DEFAULT_PRELOAD_OFFSET_VIEWPORT} from '../../../constants/LazyLoad';
import Skeleton from '@mui/material/Skeleton';
import classNames from 'classnames';

const PREFIX = 'SCPreviewMediaLink';

const classes = {
  previewLink: `${PREFIX}-preview-link`,
  previewVideo: `${PREFIX}-preview-video`,
  thumbnail: `${PREFIX}-thumbnail`,
  thumbnailFullWidth: `${PREFIX}-thumbnail`,
  image: `${PREFIX}-image`,
  snippet: `${PREFIX}-snippet`,
  snippetTitle: `${PREFIX}-snippet-title`,
  snippetDescription: `${PREFIX}-snippet-description`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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

  // HANDLERS
  const handleLinkClick = (link) => {
    onMediaClick && onMediaClick(link);
  };

  // RENDER

  /**
   * Renders link preview
   * @param (link)
   * @param(key)
   */
  const renderPreview = (link, key) => {
    const domain = new URL(link.embed.metadata.url).hostname.replace('www.', '');
    return (
      <Box className={classes.previewLink} key={key}>
        {link.embed.metadata.images.length > 0 && (
          <>
            {fullWidth ? (
              <Box
                className={classNames(classes.thumbnailFullWidth, classes.image)}
                style={{background: `url(${link.image})`, paddingBottom: `${100 / link.image_width / link.image_height}%`}}
              />
            ) : (
              <Box className={classNames(classes.thumbnail, classes.image)} style={{background: `url(${link.image})`}} />
            )}
          </>
        )}
        <Box className={classes.snippet}>
          <b className={classes.snippetTitle}>{link.embed.metadata.title}</b>
          <br />
          <p className={classes.snippetDescription}>{link.embed.metadata.description}</p>
          <a href={link.embed.metadata.url} target={'_blank'} onClick={() => handleLinkClick(link)}>
            {domain}
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
        <Root>
          {adornment}
          {medias.map((l, i) => {
            if (l.embed.metadata && l.embed.metadata.type === MEDIA_TYPE_VIDEO) {
              return (
                <LazyLoad
                  className={classes.previewVideo}
                  placeholder={<Skeleton variant="rectangular" height={360} width={'100%'} />}
                  key={i}
                  once
                  offset={DEFAULT_PRELOAD_OFFSET_VIEWPORT}>
                  <AutoPlayer url={l.url} width={'100%'} key={i} onVideoWatch={() => handleLinkClick(l)} />
                </LazyLoad>
              );
            }
            return <React.Fragment key={i}>{renderPreview(l, i)}</React.Fragment>;
          })}
        </Root>
      )}
    </>
  );
};
