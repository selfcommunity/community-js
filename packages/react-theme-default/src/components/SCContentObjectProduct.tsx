const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      borderRadius: '3px !important',
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.grey[50],
        '& .MuiAccordionSummary-content': {
          display: 'block',
          flexDirection: 'row',
          '& .MuiTypography-body1': {
            fontWeight: 200,
            color: theme.palette.grey[600]
          }
        },
        '& .MuiAccordionDetails-root': {
          marginTop: theme.spacing()
        }
      },
      '& .SCContentObjectProductPrice-root': {
        marginBottom: theme.spacing(),
        width: '95%',
        borderRadius: '3px',
        [theme.breakpoints.down('md')]: {
          width: '88%',
          borderRadius: '3px'
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      borderRadius: '3px !important',
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.grey[50],
        marginBottom: theme.spacing(1)
      },
      '& .SCContentObjectProductPrice-skeleton-root': {
        marginBottom: theme.spacing(),
        width: '95%',
        [theme.breakpoints.down('md')]: {
          width: '88%'
        }
      }
    })
  }
};

export default Component;
