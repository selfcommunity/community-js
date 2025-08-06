const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .MuiDialogTitle-root': {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 600
      },
      '& .MuiDialogContent-root': {
        display: 'flex',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
        '& .SCWidget-root': {
          minWidth: 310
        },
        '& .MuiTypography-body2': {
          marginTop: theme.spacing(1)
        }
      }
    })
  }
};

export default Component;
