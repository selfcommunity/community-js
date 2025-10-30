import {Box, Icon, IconButton, Stack, styled, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {Link} from '@selfcommunity/react-core';
import {SCMediaType, SCMimeTypes} from '@selfcommunity/types';
import {HTMLAttributes, useCallback} from 'react';
import classNames from 'classnames';
import txt from '../../../assets/composer/txt';
import pdf from '../../../assets/composer/pdf';
import doc from '../../../assets/composer/doc';
import xls from '../../../assets/composer/xls';
import ppt from '../../../assets/composer/ppt';
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
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function DocComponent(props: DocComponentProps) {
  const {document, index, onDelete, handleDownload, onMediaClick, className} = props;

  const getImage = useCallback(() => {
    switch (document.mimetype) {
      case SCMimeTypes.PLAIN_TEXT:
      case SCMimeTypes.CSV:
        return txt;
      case SCMimeTypes.PDF:
        return pdf;
      case SCMimeTypes.DOC:
      case SCMimeTypes.DOCX:
      case SCMimeTypes.DOTX:
      case SCMimeTypes.DOCM:
      case SCMimeTypes.DOTM:
        return doc;
      case SCMimeTypes.XLS:
      case SCMimeTypes.XLSX:
      case SCMimeTypes.XLTX:
      case SCMimeTypes.XLSM:
      case SCMimeTypes.XLTM:
      case SCMimeTypes.XLAM:
      case SCMimeTypes.XLSB:
        return xls;
      case SCMimeTypes.PPT:
      case SCMimeTypes.PPTX:
      case SCMimeTypes.POTX:
      case SCMimeTypes.PPSX:
      case SCMimeTypes.PPAM:
      case SCMimeTypes.PPTM:
      case SCMimeTypes.POTM:
      case SCMimeTypes.PPSM:
        return ppt;
      default:
        return fallback;
    }
  }, [document.mimetype]);

  return (
    <Root className={classNames(classes.docRoot, className)}>
      <Box component="img" alt={document.title} src={getImage()} />
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
              {document.mimetype === SCMimeTypes.PDF && (
                <IconButton className={classes.action} component={Link} to={document.url} target="_blank" onClick={() => onMediaClick?.(document)}>
                  <Icon>visibility</Icon>
                </IconButton>
              )}
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
