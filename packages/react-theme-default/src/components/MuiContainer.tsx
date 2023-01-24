const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      [theme.breakpoints.down('md')]: {
        paddingLeft: 0,
        paddingRight: 0
      }
    })
  }
};

export default Component;
