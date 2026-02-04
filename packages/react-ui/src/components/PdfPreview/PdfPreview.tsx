import React from 'react';
import {ReactElement, useCallback, useEffect, useState} from 'react';
import {Box, styled, useMediaQuery, useTheme} from '@mui/material';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {Document, Page, pdfjs} from 'react-pdf';
import {Logger} from '@selfcommunity/utils';
import Skeleton from './Skeleton';
import {http, HttpResponse} from '@selfcommunity/api-services';
import {SCThemeType, SCUserContextType, useResizeObserver, useSCUser} from '@selfcommunity/react-core';
import {SCOPE_SC_UI} from '../../constants/Errors';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const PREFIX = 'SCPdfPreview';

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
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

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
}

export default function PdfPreview(inProps: PdfPreviewProps): ReactElement | null {
  // PROPS
  const props: PdfPreviewProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, pdfUrl, maxWidth = PdfMaxWidth, ...rest} = props;

  // STATE
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [url, setUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(maxWidth);
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      const response: HttpResponse<Blob> = await http.request({url, responseType: 'blob'});
      return response.data;
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
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [scUserContext.user, scUserContext.session]);

  function renderDocument() {
    return (
      <Document onLoadSuccess={onDocumentLoadSuccess} loading={<Skeleton />} file={url} className={classes.documentPdf} options={options}>
        {Array.from({length: numPages}, (_el, index) => {
          return (
            <Page
              className={classes.documentPdfPage}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
              renderTextLayer={false}
              scale={!isMobile ? 0.7 : undefined}
            />
          );
        })}
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
    </Root>
  );
}
