const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& h2 .MuiIconButton-root': {
        top: theme.spacing(1)
      },
      '& .MuiDialogContent-root': {
        '& img': {
          width: '100%',
          height: '100%',
          maxHeight: theme.spacing(75)
        },
        '& .MuiButtonBase-root': {
          background: theme.palette.common.white,
          position: 'absolute',
          right: theme.spacing(6),
          bottom: theme.spacing(6),
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
