const Component = {
  styleOverrides: {
    requestRoot: ({theme}) => ({}),
    drawerRoot: ({theme}) => ({
      '& > div.MuiPaper-root': {
        padding: theme.spacing(2)
      }
    })
  }
};

export default Component;
