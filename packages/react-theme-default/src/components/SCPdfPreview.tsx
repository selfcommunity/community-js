const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      display: 'flex',
      flexDirection: 'column',
      marginTop: '12px',
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
        pageBreakAfter: 'always',
        '& .react-pdf__Page__textContent': {
          mixBlendMode: 'multiply',
          opacity: 0.6
        },
        '& .react-pdf__Page__canvas': {
          margin: 'auto'
        }
      }
    })
  }
};

export default Component;
