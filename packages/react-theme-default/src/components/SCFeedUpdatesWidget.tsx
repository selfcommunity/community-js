const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginBottom: theme.spacing(2),
      '& div:last-child': {
        paddingBottom: theme.spacing(2)
      }
    })
  }
};

export default Component;
