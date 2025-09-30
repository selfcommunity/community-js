const Component = {
  defaultProps: {
    enterDelay: 500
  },
  styleOverrides: {
    tooltip: ({theme}: any) => ({
      borderRadius: theme.spacing(0.5)
    })
  }
};

export default Component;
