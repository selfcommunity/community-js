const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCategories-categories': {
        marginTop: theme.spacing(3),
        '& .SCCategories-category': {
          padding: theme.spacing(2),
          width: 'auto',
          '& .SCCategory-category-image': {
            borderRadius: 0
          }
        }
      }
    })
  }
};

export default Component;
