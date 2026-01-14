const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCCheckoutHeaderInfoWidget-header': {
        height: theme.spacing(10),
        position: 'relative',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center',
        '& img': {
          position: 'absolute',
          left: '50%',
          top: theme.spacing(1),
          transform: 'translateX(-50%)'
        },
        '& .MuiIcon-root': {
          top: theme.spacing(5),
          position: 'relative'
        }
      },
      '& .SCCheckoutHeaderInfoWidget-content': {
        padding: theme.spacing(1.5),
        justifyContent: 'center',
        '& .MuiTypography-body2': {
          paddingTop: theme.spacing(1),
          whiteSpace: 'pre-line'
        }
      }
    })
  }
};

export default Component;
