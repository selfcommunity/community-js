const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialogContent-root': {
        '& img': {
          width: '100%',
          height: '100%',
          maxHeight: theme.spacing(75)
        },
        '& .MuiButtonBase-root': {
          background: theme.palette.common.white,
          position: 'absolute',
          right: theme.spacing(3),
          bottom: theme.spacing(3),
          '& .MuiIcon-root': {
            color: theme.palette.secondary.main,
            fontSize: '2rem'
          }
        }
      }
    })
  }
};

export default Component;
