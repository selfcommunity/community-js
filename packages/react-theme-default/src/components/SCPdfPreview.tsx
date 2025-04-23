const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      [`& .SCPdfPreview-document-pdf-wrapper`]: {
        filter: 'drop-shadow(0 0 5px #00000040)'
      },
      [`& .SCPdfPreview-document-pdf-link`]: {
        padding: 10,
        '&:hover': {
          opacity: 0.5
        }
      },
      [`& .SCPdfPreview-document-pdf-page`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: theme.spacing(3),
        pageBreakAfter: 'always'
      }
    })
  }
};

export default Component;
