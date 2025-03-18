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
        gap: 0,
        [theme.breakpoints.down(1034)]: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        ['& .SCCheckout-content-object']: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          [theme.breakpoints.down('sm')]: {
            width: '90%'
          },
          '& .SCWidget-root': {
            width: '93%'
          }
        },
        ['& .SCCheckout-content-desc']: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          [theme.breakpoints.down(1034)]: {
            display: 'none'
          },
          maxWidth: 600,
          padding: theme.spacing(4)
        }
      },
      ['& .SCCheckout-checkout']: {
        width: '100%',
        bottom: theme.spacing(2)
      },
      ['& .SCCheckout-object']: {
        margin: theme.spacing(2, 2, 0.5, 0),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          minWidth: 395,
          width: 'auto'
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
      }
    })
  }
};

export default Component;
