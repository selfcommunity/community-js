const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategorySkeleton-root': {
        padding: theme.spacing()
      },
      '& .SCCategorySkeleton-image': {
        borderRadius: '50px'
      }
    })
  }
};

export default Component;
