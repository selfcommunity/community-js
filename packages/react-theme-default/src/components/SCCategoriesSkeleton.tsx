const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoriesSkeleton-categories': {
        marginTop: theme.spacing(3),
        '& .SCCategorySkeleton-root': {
          padding: theme.spacing(2),
          width: 'auto',
          '& .SCCategorySkeleton-image': {
            borderRadius: 0
          }
        }
      }
    })
  }
};

export default Component;
