const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      marginBottom: theme.spacing(2),
      borderRadius: '10px',
      boxShadow: 'none',
      backgroundColor: theme.palette.grey['A200'],
      '& .MuiCardContent-root': {
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
      '& .SCPaymentProductPrice-root': {
        width: 'auto',
        paddingLeft: `${theme.spacing(0)} !important`
      }
    }),
    skeletonRoot: ({theme}) => ({
      marginBottom: theme.spacing(2),
      borderRadius: '10px',
      boxShadow: 'none',
      backgroundColor: theme.palette.grey['A200'],
      '& .MuiCardContent-root': {
        marginBottom: theme.spacing(1),
        '& .SCBaseItem-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      },
      '& .SCPaymentProductPrice-skeleton-root': {
        marginTop: theme.spacing(1),
        width: 'auto',
        paddingLeft: `${theme.spacing(0)} !important`
      }
    })
  }
};

export default Component;
