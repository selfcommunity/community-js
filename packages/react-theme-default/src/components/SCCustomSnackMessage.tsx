const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: 370,
      [theme.breakpoints.up('sm')]: {
        minWidth: '345px !important'
      },
      '& .SCCustomSnackMessage-card': {
        width: '100%',
        '& .SCCustomSnackMessage-content': {
          position: 'relative',
          padding: theme.spacing(2, 4, 2, 2),
          '& .SCCustomSnackMessage-close': {
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1
          },
          a: {
            color: theme.palette.text.primary,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }
      }
    })
  }
};

export default Component;
