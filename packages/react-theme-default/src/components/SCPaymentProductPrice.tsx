const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      borderRadius: '3px',
      '& .SCPaymentProductPrice-button-purchased': {
        backgroundColor: `${theme.palette.secondary.main} !important`,
        color: `${theme.palette.secondary.contrastText} !important`
      },
      '& .SCPaymentProductPrice-purchased-at': {
        textDecoration: 'underline'
      }
    }),
    skeletonRoot: ({theme}) => ({
      borderRadius: '3px'
    })
  }
};

export default Component;
