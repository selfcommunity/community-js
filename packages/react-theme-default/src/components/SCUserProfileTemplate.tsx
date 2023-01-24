const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      marginTop: 0,
      [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(4)
      }
    })
  }
};

export default Component;
