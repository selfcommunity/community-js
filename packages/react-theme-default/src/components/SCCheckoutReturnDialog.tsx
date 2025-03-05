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
        }
      },
      '& .SCCheckoutSuccessDialog-content-object': {
        width: '100%'
      }
    })
  }
};

export default Component;
