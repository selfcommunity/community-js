const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      ['& .SCCheckout-content']: {
        width: '100%',
        maxWidth: 860,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: theme.spacing(2),
        gap: 0,
        [theme.breakpoints.down(1034)]: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        ['& .SCCheckout-content-object']: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          [theme.breakpoints.down('sm')]: {
            width: '90%'
          },
          '& .SCWidget-root': {
            width: '93%',
            '& .SCEvent-preview-content': {
              padding: `${theme.spacing(2)} !important`
            }
          }
        },
        ['& .SCCheckout-content-coverage']: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent'
        },
        ['& .SCCheckout-content-desc']: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          [theme.breakpoints.down(1034)]: {
            display: 'none'
          },
          maxWidth: 600
        }
      },
      ['& .SCCheckout-checkout']: {
        width: '100%',
        bottom: theme.spacing(2)
      },
      ['& .SCCheckout-object']: {
        // margin: theme.spacing(2, 2, 0.5, 0),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          minWidth: 395,
          width: 'auto'
        }
      },
      ['& .SCCheckout-payment-order']: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(5),
        '& .SCPaymentOrder-root': {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& .SCPaymentOrder-content-object': {
            minWidth: 300
          },
          '& .SCPaymentOrder-details': {
            minWidth: 300
          },
          '& .SCPaymentOrderPdfButton-root': {
            paddingLeft: theme.spacing(),
            paddingRight: theme.spacing()
          }
        },
        '& .SCPaymentOrder-skeleton-root': {
          minWidth: 300
        }
      },
      ['& .SCCategory-root']: {
        borderRadius: theme.shape.borderRadius,
        '& a': {
          padding: theme.spacing(2)
        }
      },
      ['& .SCGroup-root']: {
        borderRadius: theme.shape.borderRadius,
        '& a': {
          padding: theme.spacing(2)
        }
      },
      ['& .SCCourse-preview-root']: {
        minHeight: 'auto'
      }
    })
  }
};

export default Component;
