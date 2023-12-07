const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiTypography-root': {
        marginBottom: theme.spacing(2)
      },
      '& .SCAccountDataPortability-create-button': {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing()
      },
      '& .SCAccountDataPortability-download-button': {
        marginBottom: theme.spacing()
      },
      '& .SCAccountDataPortability-generation-info': {
        fontWeight: theme.typography.fontWeightBold
      }
    })
  }
};

export default Component;
