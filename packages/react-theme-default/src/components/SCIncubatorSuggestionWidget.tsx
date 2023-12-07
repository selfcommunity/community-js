const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiCardContent-root': {
        padding: theme.spacing(2)
      }
    }),
    dialogRoot: ({theme}: any) => ({}),
    skeletonRoot: ({theme}: any) => ({})
  }
};

export default Component;
