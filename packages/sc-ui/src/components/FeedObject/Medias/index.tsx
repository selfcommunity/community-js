import React from 'react';
import {styled} from '@mui/material/styles';
import LazyLoad from 'react-lazyload';
import GridImage from './GridImage';
import AutoPlayer from './AutoPlayer';
import {MAX_GRID_IMAGES, MEDIA_TYPE_DOCUMENT, MEDIA_TYPE_IMAGE, MEDIA_TYPE_URL} from '../../../constants/Media';
import classNames from 'classnames';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Link from './Link';
import Box from '@mui/material/Box';
import CentralProgress from '../../../shared/CentralProgress';

const PREFIX = 'SCPostMedias';

const classes = {
  medias: `${PREFIX}-medias`,
  videos: `${PREFIX}-videos`,
  links: `${PREFIX}-links`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.medias}`]: {
    position: 'relative',
    marginTop: 0,
    marginBottom: theme.spacing(),
    marginLeft: -23,
    marginRight: -23
  },

  [`& .${classes.videos}`]: {
    marginLeft: -11,
    marginRight: -11
  },

  [`& .${classes.links}`]: {
    marginTop: 0,
    marginBottom: theme.spacing(),
    marginLeft: theme.spacing(-1.5),
    marginRight: theme.spacing(-1.5)
  }
}));

const MEDIA_EMBED_SC_LINK_TYPE = 'sc_link';
const MEDIA_EMBED_SC_VIMEO_TYPE = 'sc_vimeo';

export default function Medias({
  medias,
  GridImageProps = {},
  imagesAdornment = null,
  videosAdornment = null,
  documentsAdornment = null,
  linksAdornment = null
}: {
  medias: Array<any>;
  GridImageProps?: any;
  imagesAdornment?: React.ReactNode;
  videosAdornment?: React.ReactNode;
  documentsAdornment?: React.ReactNode;
  linksAdornment?: React.ReactNode;
}): JSX.Element {
  if (!medias.length) {
    // Feed without any medias
    return null;
  }

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

  const images = medias.filter((e) => e.type === MEDIA_TYPE_IMAGE).map((e) => e.image);
  const videos = medias.filter((e) => e.type === MEDIA_TYPE_URL && e.embed && e.embed.embed_type === MEDIA_EMBED_SC_VIMEO_TYPE);
  const links = medias.filter((e) => e.type === MEDIA_TYPE_URL && e.embed && e.embed.embed_type === MEDIA_EMBED_SC_LINK_TYPE);
  const docs = medias.filter((e) => e.type === MEDIA_TYPE_DOCUMENT).map((e) => ({image: e.image, title: e.title, type: e.type, url: e.url}));
  return (
    <Root>
      {videos.length > 0 && (
        <div className={classNames(classes.medias, classes.videos)}>
          {videosAdornment}
          {videos.map((v, i) => (
            <React.Fragment key={i}>
              <LazyLoad height={360} placeholder={<CentralProgress size={20} />} key={i} once>
                <AutoPlayer url={v.url} width={'100%'} />
              </LazyLoad>
            </React.Fragment>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <div className={classes.medias}>
          <LazyLoad height={300} placeholder={<CentralProgress size={20} />} once>
            <GridImage images={images} {...GridImageProps} adornment={imagesAdornment} />
          </LazyLoad>
        </div>
      )}
      {docs.length > 0 && (
        <div className={classes.medias}>
          <LazyLoad height={300} placeholder={<CentralProgress size={20} />} once>
            <GridImage
              images={docs}
              title
              renderOverlay={() => <ZoomInIcon />}
              onClickEach={this.handleClickOnPdf}
              {...GridImageProps}
              adornment={documentsAdornment}
            />
          </LazyLoad>
        </div>
      )}
      {links.length > 0 && (
        <div className={classNames(classes.medias, classes.links)}>
          {linksAdornment}
          {links.map((p, i) => (
            <Link key={i} media={p} fullWidth={medias.length === 1} />
          ))}
        </div>
      )}
    </Root>
  );
}
