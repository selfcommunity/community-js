const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategorySkeleton-primary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategorySkeleton-secondary': {
        marginBottom: theme.spacing(1)
      },
      '& .SCCategorySkeleton-action': {
        margin: theme.spacing(0.5)
      }
    })
  }
};

export default Component;
