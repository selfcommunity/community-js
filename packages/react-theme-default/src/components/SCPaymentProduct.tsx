const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      borderRadius: '3px !important',
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.grey[50],
        '& .MuiAccordionSummary-content': {
          display: 'block',
          flexDirection: 'row',
          '& .SCBaseItem-root': {
            backgroundColor: 'transparent'
          },
          '& .MuiTypography-body1': {
            fontWeight: 200,
            color: theme.palette.grey[600],
            [theme.breakpoints.down('sm')]: {
              fontSize: theme.typography.pxToRem(12)
            }
          }
        },
        '& .MuiAccordionDetails-root': {
          marginTop: theme.spacing()
        }
      },
      '& .SCPaymentProductPrice-root': {
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
        marginBottom: theme.spacing(1),
        '& .SCBaseItem-root': {
          backgroundColor: 'transparent'
        }
      },
      '& .SCPaymentProductPrice-skeleton-root': {
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
