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
          alignItems: 'flex-start'
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
        marginTop: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
          minWidth: 395
        }
      }
    })
  }
};

export default Component;
