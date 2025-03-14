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
        width: 'auto',
        borderRadius: '3px'
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
        width: 'auto'
      }
    })
  }
};

export default Component;
