import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {Box, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {Document, Page, pdfjs} from 'react-pdf';
import Button from '@mui/material/Button';
import Skeleton from './Skeleton';
import {SCUserContextType, useResizeObserver, useSCUser} from '@selfcommunity/react-core';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const PREFIX = 'PWAInvoicePdfView';

const classes = {
  root: `${PREFIX}-root`,
  documentPdfWrapper: `${PREFIX}-document-pdf-wrapper`,
  documentPdfLink: `${PREFIX}-document-pdf-link`,
  documentPdf: `${PREFIX}-document-pdf`,
  documentPdfPage: `${PREFIX}-document-pdf-page`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  [`& .${classes.documentPdfWrapper}`]: {
    filter: 'drop-shadow(0 0 5px #00000040)'
  },
  [`& .${classes.documentPdfLink}`]: {
    padding: 10,
    '&:hover': {
      opacity: 0.5
    }
  },
  [`& .${classes.documentPdfPage}`]: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

// Default options conf PDFViewer
const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  externalLinkTarget: '_blank',
  loading: <Skeleton />
};
export const PdfMaxWidth = 1280;
const resizeObserverOptions = {};

export interface PdfPreviewProps {
  className?: string;
  pdfUrl?: string;
  maxWidth?: number;
  hideDownloadLink?: boolean;
}

export default function PdfPreview(inProps: PdfPreviewProps): ReactElement | null {
  // PROPS
  const props: PdfPreviewProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, pdfUrl, maxWidth = PdfMaxWidth, hideDownloadLink = false, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [url, setUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(maxWidth);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({numPages: nextNumPages}: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setIsLoading(false);
  }

  const fetchBlob = useCallback(
    async (url: string) => {
      const request = await fetch(url, {
        headers: {
          ...(scUserContext.user && {Authorization: `Bearer ${scUserContext.session.authToken.accessToken}`})
        }
      });
      return await request.blob();
    },
    [scUserContext.user, scUserContext.session]
  );

  useEffect(() => {
    if (pdfUrl) {
      fetchBlob(pdfUrl)
        .then((res) => {
          const blob = new Blob([res], {type: 'application/pdf'});
          const _url = URL.createObjectURL(blob);
          setUrl(_url);
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [scUserContext.user, scUserContext.session]);

  function renderDocument() {
    return (
      <Document onLoadSuccess={onDocumentLoadSuccess} loading={<Skeleton />} file={pdfUrl} className={classes.documentPdf} options={options}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            className={classes.documentPdfPage}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
          />
        ))}
      </Document>
    );
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.documentPdfWrapper} ref={setContainerRef}>
        {isLoading || !pdfUrl ? (
          <Box className={classes.documentPdfPage}>
            <Skeleton maxWidth={maxWidth} />
          </Box>
        ) : (
          <>{renderDocument()}</>
        )}
      </Box>
      {url && !isLoading && !hideDownloadLink && (
        <Button size="small" variant="text" color={'inherit'} href={url} target={'_blank'}>
          <FormattedMessage id="ui.pdfPreview.download" defaultMessage="ui.pdfPreview.download" />
        </Button>
      )}
    </Root>
  );
}
