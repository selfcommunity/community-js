import {Box, Button, Icon, IconButton, Stack, styled, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {Link} from '@selfcommunity/react-core';
import {SCMediaType} from '@selfcommunity/types';
import {useCallback} from 'react';
import avi from '../../../assets/composer/avi';
import mp3 from '../../../assets/composer/mp3';
import pdf from '../../../assets/composer/pdf';
import ppt from '../../../assets/composer/ppt';
import psd from '../../../assets/composer/psd';
import txt from '../../../assets/composer/txt';
import xls from '../../../assets/composer/xls';
import fallback from '../../../assets/composer/fallback';

const classes = {
  docRoot: `${PREFIX}-doc-root`,
  imageWrapper: `${PREFIX}-image-wrapper`,
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
  document: SCMediaType;
  index?: number;
  onDelete?: (id: number) => void;
  handleDownload?: (id: number) => void;
  onMediaClick?: (media: SCMediaType) => void;
}

export default function DocComponent(props: DocComponentProps) {
  const {document, index, onDelete, handleDownload, onMediaClick} = props;

  const getImage = useCallback(() => {
    switch (document.type) {
      case 'avi':
        return avi;
      case 'doc':
        return pdf; // TODO - use "doc" instead of "pdf" after api will be updated
      case 'mp3':
        return mp3;
      case 'pdf':
        return pdf;
      case 'ppt':
        return ppt;
      case 'psd':
        return psd;
      case 'txt':
        return txt;
      case 'xsl':
        return xls;
      default:
        return fallback;
    }
  }, [document.type]);

  const imageComponent = <Box component="img" alt="pdf preview" src={getImage()} sx={{cursor: handleDownload ? 'pointer' : undefined}} />;

  return (
    <Root className={classes.docRoot}>
      {handleDownload ? (
        <Button className={classes.imageWrapper} component={Link} to={document.url} target="_blank" onClick={() => onMediaClick?.(document)}>
          {imageComponent}
        </Button>
      ) : (
        <>{imageComponent}</>
      )}
      <Stack className={classes.textWrapper}>
        <Typography className={classes.title}>{document.title}</Typography>
        {document.size && <Typography className={classes.subtitle}>{formatBytes(document.size)}</Typography>}
      </Stack>

      {(handleDownload || onDelete) && (
        <Stack className={classes.actionWrapper}>
          {onDelete && (
            <IconButton className={classes.action} onClick={() => onDelete(document.id)}>
              <Icon>delete</Icon>
            </IconButton>
          )}
          {handleDownload && (
            <>
              <IconButton className={classes.action} component={Link} to={document.url} target="_blank" onClick={() => onMediaClick?.(document)}>
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
