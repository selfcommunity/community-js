const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      borderRadius: 0,
      boxShadow: 'none',
      '& .SCPaymentProductPrice-primary': {
        fontSize: '18px',
        fontWeight: '600 !important',
        color: `${theme.palette.primary.main} !important`
      },
      '& .SCPaymentProductPrice-button': {
        textTransform: 'uppercase'
      },
      '& .SCPaymentProductPrice-button-purchased': {
        backgroundColor: `${theme.palette.secondary.main} !important`,
        color: `${theme.palette.secondary.contrastText} !important`
      },
      '& .SCPaymentProductPrice-purchased-at': {
        textDecoration: 'underline'
      }
    }),
    skeletonRoot: ({theme}) => ({
      borderRadius: 0
    })
  }
};

export default Component;
