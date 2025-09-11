import {Box, Icon, IconButton, Stack, styled, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {Link} from '@selfcommunity/react-core';
import {SCMediaType} from '@selfcommunity/types';
import {MEDIA_TYPE_DOCUMENT} from '../../../constants/Media';
import {BADGE_PDF} from './badgePdf';

const classes = {
  docRoot: `${PREFIX}-doc-root`,
  imageWrapper: `${PREFIX}-image-wrapper`,
  badgePdf: `${PREFIX}-badge-pdf`,
  textWrapper: `${PREFIX}-text-wrapper`,
  title: `${PREFIX}-title`,
  subtitle: `${PREFIX}-subtitle`,
  actionWrapper: `${PREFIX}-action-wrapper`,
  action: `${PREFIX}-action`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'DocRoot'
})(() => ({}));

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface DocComponentProps {
  doc: SCMediaType;
  index?: number;
  onDelete?: (id: number) => void;
  openPreviewImage?: (index: number, type: string) => void;
  handleDownload?: (id: number) => void;
  onMediaClick?: (media: SCMediaType) => void;
}

export default function DocComponent(props: DocComponentProps) {
  const {doc, index, onDelete, openPreviewImage, handleDownload, onMediaClick} = props;

  return (
    <Root className={classes.docRoot}>
      <Box
        onClick={() => openPreviewImage?.(index, MEDIA_TYPE_DOCUMENT)}
        sx={{cursor: openPreviewImage ? 'pointer' : undefined}}
        className={classes.imageWrapper}>
        <img alt="pdf preview" src={doc.image_thumbnail ? doc.image_thumbnail.url : doc.image} width="100%" height="100%" />
        <img alt="pdf badge" src={BADGE_PDF} className={classes.badgePdf} />
      </Box>
      <Stack className={classes.textWrapper}>
        <Typography className={classes.title}>{doc.title}</Typography>
        {doc.size && <Typography className={classes.subtitle}>{formatBytes(doc.size)}</Typography>}
      </Stack>

      {(handleDownload || onDelete) && (
        <Stack className={classes.actionWrapper}>
          {onDelete && (
            <IconButton className={classes.action} onClick={() => onDelete(doc.id)}>
              <Icon>delete</Icon>
            </IconButton>
          )}
          {handleDownload && (
            <>
              <IconButton className={classes.action} component={Link} to={doc.url} target="_blank" onClick={() => onMediaClick?.(doc)}>
                <Icon>visibility</Icon>
              </IconButton>
              <IconButton className={classes.action} onClick={() => handleDownload(index)}>
                <Icon>download</Icon>
              </IconButton>
            </>
          )}
        </Stack>
      )}
    </Root>
  );
}
