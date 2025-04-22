const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCPaymentOrder-details': {
        marginTop: theme.spacing(),
        marginLeft: theme.spacing(),
        '& p': {
          marginBottom: theme.spacing()
        },
        '& .SCPaymentOrderPdfButton-root': {
          marginTop: theme.spacing()
        }
      }
    }),
    skeletonRoot: ({theme}) => ({})
  }
};

export default Component;
