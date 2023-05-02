const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategoriesSkeleton-categories': {
        marginTop: theme.spacing(3),
        '& .SCCategorySkeleton-root': {
          padding: theme.spacing(2),
          width: 'auto',
          '& .SCBaseItem-image': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            '& .SCCategorySkeleton-image': {
              borderRadius: 0,
              width: '56px !important',
              height: '56px !important'
            }
          }
        }
      }
    })
  }
};

export default Component;
